/**
 * AI Loop - Logger Utility
 * Centralized logging system with persistence
 */

import CONFIG from '../config/constants.js';

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const levelName = Object.entries(LOG_LEVELS).reduce((acc, [name, value]) => {
  acc[value] = name;
  return acc;
}, {});

/**
 * Logger Class
 */
export class Logger {
  constructor(module = 'App') {
    this.module = module;
    this.logs = [];
    this.level = LOG_LEVELS[CONFIG.LOGGING.LEVEL] || LOG_LEVELS.INFO;
  }

  /**
   * Format log message
   */
  format(level, message, data) {
    const timestamp = CONFIG.LOGGING.INCLUDE_TIMESTAMP 
      ? new Date().toISOString() 
      : '';
    
    return {
      timestamp,
      level: levelName[level],
      module: this.module,
      message,
      data,
    };
  }

  /**
   * Store log
   */
  store(log) {
    this.logs.push(log);
    
    if (this.logs.length > CONFIG.LOGGING.MAX_LOGS) {
      this.logs.shift();
    }

    if (CONFIG.LOGGING.PERSIST_LOGS) {
      try {
        localStorage.setItem(
          'ailoop_logs',
          JSON.stringify(this.logs.slice(-100))
        );
      } catch (error) {
        console.warn('Failed to persist logs', error);
      }
    }
  }

  /**
   * Log debug message
   */
  debug(message, data = {}) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      const log = this.format(LOG_LEVELS.DEBUG, message, data);
      this.store(log);
      console.debug(`[${this.module}]`, message, data);
    }
  }

  /**
   * Log info message
   */
  info(message, data = {}) {
    if (this.level <= LOG_LEVELS.INFO) {
      const log = this.format(LOG_LEVELS.INFO, message, data);
      this.store(log);
      console.info(`[${this.module}]`, message, data);
    }
  }

  /**
   * Log warning message
   */
  warn(message, data = {}) {
    if (this.level <= LOG_LEVELS.WARN) {
      const log = this.format(LOG_LEVELS.WARN, message, data);
      this.store(log);
      console.warn(`[${this.module}]`, message, data);
    }
  }

  /**
   * Log error message
   */
  error(message, error) {
    if (this.level <= LOG_LEVELS.ERROR) {
      const errorData = {
        message: error?.message || String(error),
        name: error?.name,
      };

      if (CONFIG.LOGGING.INCLUDE_STACK && error?.stack) {
        errorData.stack = error.stack;
      }

      const log = this.format(LOG_LEVELS.ERROR, message, errorData);
      this.store(log);
      console.error(`[${this.module}]`, message, error);
    }
  }

  /**
   * Get all logs
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('ailoop_logs');
    } catch (error) {
      console.warn('Failed to clear logs', error);
    }
  }

  /**
   * Export logs as JSON
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}

/**
 * Global logger instance
 */
export const globalLogger = new Logger('Global');

export default Logger;
