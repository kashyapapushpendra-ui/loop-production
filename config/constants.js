/**
 * AI Loop - Global Constants & Configuration
 * Centralized configuration for the entire application
 */

export const CONFIG = {
  // Application Info
  APP_NAME: 'AI Loop',
  APP_VERSION: '1.0.0',
  APP_AUTHOR: 'AI Loop Team',
  APP_URL: 'https://ailoop.dev',
  
  // API Configuration
  API: {
    CLAUDE_ENDPOINT: 'https://api.anthropic.com/v1/messages',
    CLAUDE_MODEL: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
    CLAUDE_MAX_TOKENS: parseInt(process.env.CLAUDE_MAX_TOKENS || '2000', 10),
    REQUEST_TIMEOUT: parseInt(process.env.API_REQUEST_TIMEOUT || '30000', 10),
    RETRY_ATTEMPTS: parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10),
    RETRY_DELAY: parseInt(process.env.API_RETRY_DELAY || '1000', 10),
  },

  // Video Quality Presets
  QUALITY_PRESETS: {
    '720': { width: 1280, height: 720, bitrate: 5000000, codec: 'avc1.42001f', label: 'HD' },
    '1080': { width: 1920, height: 1080, bitrate: 10000000, codec: 'avc1.640028', label: 'Full HD' },
    '2K': { width: 2560, height: 1440, bitrate: 15000000, codec: 'avc1.640033', label: '2K' },
    '4K': { width: 3840, height: 2160, bitrate: 25000000, codec: 'avc1.640033', label: '4K' },
  },

  // Aspect Ratios
  ASPECT_RATIOS: {
    LANDSCAPE: { ratio: 16/9, name: '16:9 Landscape', width: 1920, height: 1080 },
    SHORTS: { ratio: 9/16, name: '9:16 YouTube Shorts', width: 1080, height: 1920 },
  },

  // Scene Timing Constraints
  SCENE: {
    MIN_DURATION: 3,
    MAX_DURATION: 90,
    DEFAULT_DURATION: 12,
    TRANSITION_DURATION: 1.1,
    FADE_IN_DURATION: 0.5,
    FADE_OUT_DURATION: 0.5,
  },

  // Audio Configuration
  AUDIO: {
    SAMPLE_RATE: 44100,
    CHANNELS: 1,
    BITRATE: 96000,
    CODECS: ['aac', 'opus'],
    AMBIENT_FREQ_1: 110, // A2 note
    AMBIENT_FREQ_2: 164.81, // E3 note
    LFO_SPEED: 0.06,
    GAIN: 0.05,
  },

  // Rendering
  RENDER: {
    FPS: 30,
    FRAME_TIMEOUT: 5000,
    PREVIEW_FPS: 24,
    PARALLEL_FRAMES: 4,
    CHECKPOINT_INTERVAL: 30,
  },

  // Storage
  STORAGE: {
    DB_NAME: 'AILoopDB',
    DB_VERSION: 1,
    STORES: ['projects', 'scenes', 'cache', 'health_logs', 'performance_metrics', 'render_checkpoints'],
    MAX_PROJECT_SIZE: 500 * 1024 * 1024, // 500MB
    AUTO_SAVE_INTERVAL: parseInt(process.env.AUTO_SAVE_INTERVAL || '30000', 10), // 30 seconds
    CACHE_CLEANUP_INTERVAL: parseInt(process.env.CACHE_CLEANUP_INTERVAL || '3600000', 10), // 1 hour
  },

  // Memory Management
  MEMORY: {
    MIN_THRESHOLD: 100 * 1024 * 1024, // 100MB
    MAX_USAGE: 300 * 1024 * 1024, // 300MB
    WARNING_THRESHOLD: 80, // 80% of max
    CLEANUP_INTERVAL: 60000, // 1 minute
    GC_TRIGGER: 85, // 85% triggers garbage collection
  },

  // Animation Parameters
  ANIMATION: {
    HILL_LAYERS: 3,
    PARTICLE_COUNT: 30,
    PARTICLE_MIN_SPEED: 4,
    PARTICLE_MAX_SPEED: 10,
    LIGHT_COUNT_MIN: 3,
    LIGHT_COUNT_MAX: 7,
    ZOOM_AMOUNT: 0.05,
    PAN_AMOUNT: 0.02,
    TRANSITION_TIME: 1.1,
    MIST_OPACITY: 0.10,
    SCRIM_OPACITY: 0.85,
  },

  // Text & Font
  TEXT: {
    PRIMARY_FONT: 'Hind',
    SERIF_FONT: 'Tiro Devanagari Hindi',
    FALLBACK_FONT: 'sans-serif',
    LINE_HEIGHT: 1.6,
    MAX_TEXT_WIDTH: 0.82,
    FONT_SIZE_SCALE: 0.052,
  },

  // Color Scheme (Dark theme)
  COLORS: {
    INK: '#efe7d8',
    INK_DIM: '#b8ac97',
    VOID: '#15110f',
    VOID_2: '#1d1712',
    EMBER: '#a8402a',
    EMBER_BRIGHT: '#d1583a',
    BRASS: '#c9a24b',
    LINE: 'rgba(239,231,216,0.14)',
    SUCCESS: '#8fbf7a',
    WARNING: '#e8b754',
    ERROR: '#d1583a',
  },

  // Health Check
  HEALTH: {
    CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL || '60000', 10), // 1 minute
    STARTUP_CHECKS: [
      'browser_capabilities',
      'api_connectivity',
      'storage_access',
      'device_memory',
      'gpu_support',
    ],
    WARNING_THRESHOLD: 3,
    ERROR_THRESHOLD: 5,
  },

  // Error Recovery
  RECOVERY: {
    AUTO_RETRY: true,
    MAX_RETRIES: parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10),
    CHECKPOINT_INTERVAL: 30, // frames
    RECOVERY_TIMEOUT: 300000, // 5 minutes
  },

  // Logging
  LOGGING: {
    LEVEL: process.env.LOG_LEVEL || 'INFO', // DEBUG, INFO, WARN, ERROR
    MAX_LOGS: parseInt(process.env.MAX_LOGS || '1000', 10),
    PERSIST_LOGS: true,
    INCLUDE_TIMESTAMP: true,
    INCLUDE_STACK: true,
  },

  // Feature Flags
  FEATURES: {
    AI_VOICE_NARRATION: process.env.ENABLE_AI_VOICE !== 'false',
    SUBTITLE_GENERATION: process.env.ENABLE_SUBTITLE_GEN !== 'false',
    CONTENT_SAFETY_CHECK: process.env.ENABLE_SAFETY_CHECK !== 'false',
    AUTO_RECOVERY: process.env.ENABLE_SELF_HEALING !== 'false',
    PERFORMANCE_MONITORING: true,
    CRASH_REPORTING: true,
    AUTO_SAVE: process.env.ENABLE_AUTO_SAVE !== 'false',
    ADVANCED_ANALYTICS: false, // For future use
  },

  // Timeouts (in milliseconds)
  TIMEOUTS: {
    API_CALL: parseInt(process.env.API_REQUEST_TIMEOUT || '30000', 10),
    RENDER_TIMEOUT: parseInt(process.env.RENDER_TIMEOUT || '600000', 10), // 10 minutes
    UPLOAD_TIMEOUT: 60000,
    HEALTH_CHECK: 10000,
    STORAGE_OPERATION: 5000,
  },

  // Validation
  VALIDATION: {
    MIN_STORY_LENGTH: 10,
    MAX_STORY_LENGTH: parseInt(process.env.MAX_STORY_LENGTH || '5000', 10),
    MIN_VIDEO_DURATION: parseInt(process.env.MIN_VIDEO_DURATION || '180', 10), // seconds
    MAX_VIDEO_DURATION: parseInt(process.env.MAX_VIDEO_DURATION || '600', 10), // seconds
    ALLOWED_MEDIA_TYPES: ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg'],
  },

  // Debug
  DEBUG: process.env.DEBUG_MODE === 'true',
  VERBOSE: process.env.VERBOSE_LOGGING === 'true',
};

/**
 * Get environment variable with fallback
 */
export function getEnv(key, fallback = '') {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  // Browser environment
  const elem = document.querySelector(`meta[data-env-${key.toLowerCase()}]`);
  return elem?.getAttribute('content') || fallback;
}

/**
 * Get config value by path
 */
export function getConfig(path, fallback = null) {
  const keys = path.split('.');
  let value = CONFIG;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }
  
  return value;
}

export default CONFIG;
