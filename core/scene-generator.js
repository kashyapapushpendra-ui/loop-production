/**
 * AI Loop - Scene Generator
 * Converts story text into animated scenes using Claude AI
 */

import CONFIG, { getEnv } from '../config/constants.js';
import { Logger } from '../utils/logger.js';
import { Validator } from '../utils/validators.js';
import { retryAsync } from '../utils/async-utils.js';

const logger = new Logger('SceneGenerator');

/**
 * Scene Generator Class
 */
export class SceneGenerator {
  constructor() {
    this.claudeApiKey = getEnv('CLAUDE_API_KEY', '');
    this.model = CONFIG.API.CLAUDE_MODEL;
    this.maxTokens = CONFIG.API.CLAUDE_MAX_TOKENS;
  }

  /**
   * Validate story input
   */
  validateStory(story) {
    const validation = Validator.validateStory(story);
    if (!validation.valid) {
      throw new Error(`Story validation failed: ${validation.errors.join(', ')}`);
    }
    return true;
  }

  /**
   * Generate scenes from story using Claude API
   */
  async generateScenes(story, targetDuration, targetSceneCount) {
    try {
      // Validate input
      this.validateStory(story);
      
      if (targetDuration < CONFIG.VALIDATION.MIN_VIDEO_DURATION) {
        throw new Error(`Duration too short (min: ${CONFIG.VALIDATION.MIN_VIDEO_DURATION}s)`);
      }
      if (targetDuration > CONFIG.VALIDATION.MAX_VIDEO_DURATION) {
        throw new Error(`Duration too long (max: ${CONFIG.VALIDATION.MAX_VIDEO_DURATION}s)`);
      }

      logger.info('Generating scenes from story', {
        storyLength: story.length,
        targetDuration,
        targetSceneCount,
      });

      // Call Claude API with retry logic
      const response = await retryAsync(
        () => this.callClaudeAPI(story, targetDuration, targetSceneCount),
        CONFIG.API.RETRY_ATTEMPTS,
        CONFIG.API.RETRY_DELAY
      );

      // Parse and validate scenes
      const scenes = this.parseSceneResponse(response);
      
      logger.info('Scenes generated successfully', {
        count: scenes.length,
        totalDuration: scenes.reduce((sum, s) => sum + s.seconds, 0),
      });

      return scenes;
    } catch (error) {
      logger.error('Scene generation failed', error);
      throw error;
    }
  }

  /**
   * Call Claude API
   */
  async callClaudeAPI(story, targetDuration, targetSceneCount) {
    const systemPrompt = this.buildSystemPrompt(targetDuration, targetSceneCount);
    const userPrompt = `Story to convert into scenes:\n\n${story}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUTS.API_CALL);

    try {
      const response = await fetch(CONFIG.API.CLAUDE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: this.maxTokens,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const textBlock = (data.content || []).find(b => b.type === 'text');
      
      if (!textBlock) {
        throw new Error('No text response from Claude');
      }

      return textBlock.text;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('API request timeout');
      }
      throw error;
    }
  }

  /**
   * Build system prompt for Claude
   */
  buildSystemPrompt(targetDuration, targetSceneCount) {
    return `You are a professional screenplay writer. Your task is to break a user's story into visual scenes for animation.

Constraints:
- Total duration must be approximately ${targetDuration} seconds
- Generate exactly ${targetSceneCount} scenes (±2 is acceptable)
- Minimum scene duration: ${CONFIG.SCENE.MIN_DURATION}s
- Maximum scene duration: ${CONFIG.SCENE.MAX_DURATION}s
- Each scene text: 1-2 lines only (10-30 words max)
- Only describe what's visible on screen
- Do NOT invent new plot elements beyond the story
- Do NOT add characters not in the original story
- Do NOT change the narrative flow

Response format (ONLY valid JSON array, no other text):
[
  {"text": "Scene description in ${process.env.DEFAULT_LANGUAGE || 'hi'}", "seconds": 12},
  {"text": "Next scene description", "seconds": 14}
]

Send ONLY the JSON array. No markdown, no explanations, no extra text.`;
  }

  /**
   * Parse Claude's JSON response
   */
  parseSceneResponse(rawResponse) {
    try {
      let jsonStr = rawResponse.trim();
      
      // Extract JSON from potential markdown code blocks
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      
      // Find JSON array boundaries
      const startIdx = jsonStr.indexOf('[');
      const endIdx = jsonStr.lastIndexOf(']');
      
      if (startIdx === -1 || endIdx === -1) {
        throw new Error('No JSON array found in response');
      }
      
      jsonStr = jsonStr.substring(startIdx, endIdx + 1);
      const parsed = JSON.parse(jsonStr);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }

      // Validate and normalize scenes
      return parsed
        .filter(scene => scene && scene.text)
        .map(scene => ({
          text: String(scene.text).trim(),
          seconds: Math.max(
            CONFIG.SCENE.MIN_DURATION,
            Math.min(
              CONFIG.SCENE.MAX_DURATION,
              Math.round(Number(scene.seconds) || CONFIG.SCENE.DEFAULT_DURATION)
            )
          ),
        }))
        .slice(0, 100); // Safety limit
    } catch (error) {
      logger.error('Failed to parse scene response', error);
      throw new Error(`Scene parsing failed: ${error.message}`);
    }
  }
}

export default SceneGenerator;
