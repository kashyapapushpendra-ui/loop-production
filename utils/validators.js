/**
 * AI Loop - Input Validators
 * Comprehensive input validation and sanitization
 */

import CONFIG from '../config/constants.js';

/**
 * Validator Class
 */
export class Validator {
  /**
   * Validate story input
   */
  static validateStory(story) {
    const errors = [];

    if (!story || typeof story !== 'string') {
      errors.push('Story must be a string');
    } else {
      const trimmed = story.trim();
      
      if (trimmed.length < CONFIG.VALIDATION.MIN_STORY_LENGTH) {
        errors.push(`Story must be at least ${CONFIG.VALIDATION.MIN_STORY_LENGTH} characters`);
      }
      
      if (trimmed.length > CONFIG.VALIDATION.MAX_STORY_LENGTH) {
        errors.push(`Story must not exceed ${CONFIG.VALIDATION.MAX_STORY_LENGTH} characters`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate video duration
   */
  static validateDuration(minutes) {
    const errors = [];
    const seconds = minutes * 60;

    if (typeof minutes !== 'number' || isNaN(minutes)) {
      errors.push('Duration must be a number');
    } else if (seconds < CONFIG.VALIDATION.MIN_VIDEO_DURATION) {
      errors.push(`Duration must be at least ${CONFIG.VALIDATION.MIN_VIDEO_DURATION / 60} minutes`);
    } else if (seconds > CONFIG.VALIDATION.MAX_VIDEO_DURATION) {
      errors.push(`Duration must not exceed ${CONFIG.VALIDATION.MAX_VIDEO_DURATION / 60} minutes`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate resolution
   */
  static validateResolution(resolution) {
    const errors = [];
    const validResolutions = Object.keys(CONFIG.QUALITY_PRESETS);

    if (!validResolutions.includes(String(resolution))) {
      errors.push(`Resolution must be one of: ${validResolutions.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate audio mode
   */
  static validateAudioMode(mode) {
    const errors = [];
    const validModes = ['silent', 'music', 'mic'];

    if (!validModes.includes(mode)) {
      errors.push(`Audio mode must be one of: ${validModes.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate scene
   */
  static validateScene(scene) {
    const errors = [];

    if (!scene || typeof scene !== 'object') {
      errors.push('Scene must be an object');
      return { valid: false, errors };
    }

    if (!scene.text || typeof scene.text !== 'string') {
      errors.push('Scene text is required and must be a string');
    } else if (scene.text.trim().length < 5) {
      errors.push('Scene text must be at least 5 characters');
    } else if (scene.text.length > 500) {
      errors.push('Scene text must not exceed 500 characters');
    }

    if (!scene.seconds || typeof scene.seconds !== 'number') {
      errors.push('Scene duration must be a number');
    } else if (scene.seconds < CONFIG.SCENE.MIN_DURATION) {
      errors.push(`Scene duration must be at least ${CONFIG.SCENE.MIN_DURATION}s`);
    } else if (scene.seconds > CONFIG.SCENE.MAX_DURATION) {
      errors.push(`Scene duration must not exceed ${CONFIG.SCENE.MAX_DURATION}s`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize text input (XSS protection)
   */
  static sanitizeText(text) {
    if (typeof text !== 'string') return '';
    
    return text
      .replace(/[<>"']/g, char => {
        const escapeMap = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
        };
        return escapeMap[char];
      })
      .trim();
  }

  /**
   * Validate file MIME type
   */
  static validateFileMimeType(file) {
    const errors = [];
    const allowedTypes = CONFIG.VALIDATION.ALLOWED_MEDIA_TYPES;

    if (!file || !(file instanceof File)) {
      errors.push('Invalid file');
    } else if (!allowedTypes.includes(file.type)) {
      errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate API key format
   */
  static validateApiKey(key) {
    const errors = [];

    if (!key || typeof key !== 'string') {
      errors.push('API key must be a string');
    } else if (key.length < 10) {
      errors.push('API key seems too short');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default Validator;
