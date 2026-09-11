/**
 * AI Loop - Audio Processor
 * Handles audio synthesis, narration, and sync management
 */

import CONFIG from '../config/constants.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('AudioProcessor');

/**
 * Audio Processor Class
 */
export class AudioProcessor {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.isSupported = this.checkSupport();
  }

  /**
   * Check if Web Audio API is supported
   */
  checkSupport() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return !!AudioContext;
  }

  /**
   * Initialize audio context
   */
  async initialize() {
    try {
      if (!this.isSupported) {
        throw new Error('Web Audio API not supported');
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.7;
      
      logger.info('Audio context initialized', {
        sampleRate: this.audioContext.sampleRate,
        state: this.audioContext.state,
      });
      
      return true;
    } catch (error) {
      logger.error('Audio initialization failed', error);
      throw error;
    }
  }

  /**
   * Ensure audio context is running
   */
  async ensureRunning() {
    if (!this.audioContext) {
      await this.initialize();
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Generate ambient music audio data
   */
  async generateAmbientMusic(durationSeconds) {
    try {
      await this.ensureRunning();

      const sampleRate = this.audioContext.sampleRate;
      const OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const samples = Math.ceil(durationSeconds * sampleRate);
      
      const offlineCtx = new OfflineContext(1, samples, sampleRate);
      
      // Two sine waves at different frequencies
      const osc1 = offlineCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = CONFIG.AUDIO.AMBIENT_FREQ_1; // A2
      
      const osc2 = offlineCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = CONFIG.AUDIO.AMBIENT_FREQ_2; // E3
      
      // LFO for modulation
      const lfo = offlineCtx.createOscillator();
      lfo.frequency.value = CONFIG.AUDIO.LFO_SPEED;
      
      const lfoGain = offlineCtx.createGain();
      lfoGain.gain.value = 0.02;
      
      // Main gain
      const gainNode = offlineCtx.createGain();
      gainNode.gain.value = CONFIG.AUDIO.GAIN;
      
      // Connections
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(offlineCtx.destination);
      
      // Start/stop
      osc1.start(0);
      osc2.start(0);
      lfo.start(0);
      osc1.stop(durationSeconds);
      osc2.stop(durationSeconds);
      lfo.stop(durationSeconds);
      
      logger.info('Rendering ambient music', {
        duration: durationSeconds,
        sampleRate,
      });
      
      const audioBuffer = await offlineCtx.startRendering();
      return audioBuffer.getChannelData(0);
    } catch (error) {
      logger.error('Ambient music generation failed', error);
      throw error;
    }
  }

  /**
   * Create media stream destination for recording
   */
  createMediaStreamDestination() {
    return this.audioContext.createMediaStreamDestination();
  }

  /**
   * Capture microphone input
   */
  async captureMicrophone() {
    try {
      await this.ensureRunning();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      logger.info('Microphone captured successfully');
      return stream;
    } catch (error) {
      logger.error('Microphone capture failed', error);
      throw error;
    }
  }

  /**
   * Validate audio sync
   */
  validateAudioVideoSync(audioBuffer, videoDuration, fps) {
    try {
      if (!audioBuffer || !audioBuffer.length) {
        return { valid: false, message: 'Empty audio buffer' };
      }

      const audioSampleRate = audioBuffer.length / videoDuration;
      const expectedSampleRate = CONFIG.AUDIO.SAMPLE_RATE;
      const tolerance = 100; // Hz

      if (Math.abs(audioSampleRate - expectedSampleRate) > tolerance) {
        logger.warn('Audio sample rate mismatch', {
          actual: audioSampleRate,
          expected: expectedSampleRate,
        });
      }

      const totalFrames = Math.ceil(videoDuration * fps);
      const audioFrames = Math.ceil(audioBuffer.length / CONFIG.AUDIO.SAMPLE_RATE * fps);

      const frameDiff = Math.abs(totalFrames - audioFrames);
      const tolerance_frames = 5; // Allow 5 frame difference

      return {
        valid: frameDiff <= tolerance_frames,
        videoFrames: totalFrames,
        audioFrames,
        frameDifference: frameDiff,
      };
    } catch (error) {
      logger.error('Audio-video sync validation failed', error);
      return { valid: false, message: error.message };
    }
  }

  /**
   * Cleanup audio resources
   */
  async cleanup() {
    try {
      if (this.audioContext) {
        // Stop all sources
        if (this.masterGain) {
          this.masterGain.gain.value = 0;
        }
        
        // Note: Don't close context immediately, may break active streams
        // this.audioContext.close();
      }
      
      logger.info('Audio processor cleaned up');
    } catch (error) {
      logger.error('Audio cleanup failed', error);
    }
  }
}

export default AudioProcessor;
