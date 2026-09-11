/**
 * AI Loop - Video Encoder
 * Handles video encoding using WebCodecs API and MP4 muxer
 */

import CONFIG from '../config/constants.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('VideoEncoder');

/**
 * Video Encoder Class
 */
export class VideoEncoder {
  constructor(canvas) {
    this.canvas = canvas;
    this.encoder = null;
    this.chunks = [];
  }

  /**
   * Check if WebCodecs encoding is supported
   */
  static async isSupported(codec) {
    try {
      if (!('VideoEncoder' in window)) {
        return false;
      }

      const config = {
        codec,
        width: 1280,
        height: 720,
        bitrate: 1000000,
      };

      const support = await VideoEncoder.isConfigSupported(config);
      return !!(support && support.supported);
    } catch (error) {
      logger.warn('WebCodecs support check failed', error);
      return false;
    }
  }

  /**
   * Initialize video encoder
   */
  async initialize(width, height, bitrate, codec) {
    try {
      if (!('VideoEncoder' in window)) {
        throw new Error('VideoEncoder not supported');
      }

      const config = {
        codec,
        width,
        height,
        bitrate,
      };

      const support = await VideoEncoder.isConfigSupported(config);
      if (!support.supported) {
        throw new Error(`Codec ${codec} not supported for ${width}x${height}`);
      }

      this.encoder = new VideoEncoder({
        output: (chunk, metadata) => this.handleEncodedChunk(chunk, metadata),
        error: (error) => this.handleEncodingError(error),
      });

      this.encoder.configure(config);
      this.chunks = [];

      logger.info('Video encoder initialized', {
        codec,
        width,
        height,
        bitrate,
      });

      return true;
    } catch (error) {
      logger.error('Video encoder initialization failed', error);
      throw error;
    }
  }

  /**
   * Encode a video frame
   */
  async encodeFrame(timestamp, keyFrame = false) {
    try {
      if (!this.encoder) {
        throw new Error('Encoder not initialized');
      }

      const frame = new VideoFrame(this.canvas, {
        timestamp,
        duration: 1000000 / CONFIG.RENDER.FPS,
      });

      this.encoder.encode(frame, { keyFrame });
      frame.close();

      return true;
    } catch (error) {
      logger.error('Frame encoding failed', error);
      throw error;
    }
  }

  /**
   * Handle encoded chunk
   */
  handleEncodedChunk(chunk, metadata) {
    this.chunks.push({
      chunk,
      metadata,
      timestamp: chunk.timestamp,
    });
  }

  /**
   * Handle encoding error
   */
  handleEncodingError(error) {
    logger.error('Video encoding error', error);
  }

  /**
   * Finalize encoding
   */
  async finalize() {
    try {
      if (!this.encoder) {
        throw new Error('Encoder not initialized');
      }

      await this.encoder.flush();
      logger.info('Video encoder finalized', { chunks: this.chunks.length });

      return this.chunks;
    } catch (error) {
      logger.error('Video encoder finalization failed', error);
      throw error;
    }
  }

  /**
   * Get encoded data
   */
  getEncodedData() {
    return this.chunks.map(item => item.chunk);
  }

  /**
   * Cleanup
   */
  async cleanup() {
    try {
      if (this.encoder) {
        this.encoder.close();
        this.encoder = null;
      }
      this.chunks = [];
      logger.info('Video encoder cleaned up');
    } catch (error) {
      logger.error('Video encoder cleanup failed', error);
    }
  }
}

/**
 * Check if Mp4Muxer is available
 */
export function isMp4MuxerAvailable() {
  return typeof window.Mp4Muxer !== 'undefined';
}

/**
 * Create MP4 file from video chunks
 */
export async function createMp4FromChunks(videoChunks, audioBuffer, width, height) {
  try {
    if (!isMp4MuxerAvailable()) {
      throw new Error('Mp4Muxer library not available');
    }

    const muxer = new Mp4Muxer.Muxer({
      target: new Mp4Muxer.ArrayBufferTarget(),
      video: {
        codec: 'avc',
        width,
        height,
        frameRate: CONFIG.RENDER.FPS,
      },
      audio: audioBuffer ? {
        codec: 'aac',
        numberOfChannels: CONFIG.AUDIO.CHANNELS,
        sampleRate: CONFIG.AUDIO.SAMPLE_RATE,
      } : undefined,
      fastStart: 'in-memory',
    });

    // Add video chunks
    videoChunks.forEach(chunk => {
      muxer.addVideoChunk(chunk);
    });

    // Add audio if available
    if (audioBuffer) {
      const audioEncoder = new AudioEncoder({
        output: (chunk) => muxer.addAudioChunk(chunk),
        error: (error) => {
          throw new Error(`Audio encoding failed: ${error.message}`);
        },
      });

      audioEncoder.configure({
        codec: 'mp4a.40.2',
        sampleRate: CONFIG.AUDIO.SAMPLE_RATE,
        numberOfChannels: CONFIG.AUDIO.CHANNELS,
        bitrate: CONFIG.AUDIO.BITRATE,
      });

      const frameSize = 1024;
      for (let i = 0; i < audioBuffer.length; i += frameSize) {
        const frameLength = Math.min(frameSize, audioBuffer.length - i);
        const audioData = new AudioData({
          format: 'f32-planar',
          sampleRate: CONFIG.AUDIO.SAMPLE_RATE,
          numberOfFrames: frameLength,
          numberOfChannels: CONFIG.AUDIO.CHANNELS,
          timestamp: Math.round((i / CONFIG.AUDIO.SAMPLE_RATE) * 1e6),
          data: audioBuffer.slice(i, i + frameLength),
        });
        audioEncoder.encode(audioData);
        audioData.close();
      }

      audioEncoder.flush();
    }

    muxer.finalize();
    logger.info('MP4 file created', {
      videoChunks: videoChunks.length,
      hasAudio: !!audioBuffer,
    });

    return new Blob([muxer.target.buffer], { type: 'video/mp4' });
  } catch (error) {
    logger.error('MP4 creation failed', error);
    throw error;
  }
}

export default VideoEncoder;
