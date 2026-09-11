/**
 * AI Loop - Health Monitor
 * System health tracking and diagnostics
 */

import { storage } from './storage.js';
import { Logger } from '../utils/logger.js';
import CONFIG from '../config/constants.js';

const logger = new Logger('HealthMonitor');

/**
 * Health Monitor Class
 */
export class HealthMonitor {
  constructor() {
    this.checks = {};
    this.lastCheck = null;
    this.checkInterval = null;
  }

  /**
   * Start health monitoring
   */
  startMonitoring(interval = CONFIG.HEALTH.CHECK_INTERVAL) {
    this.stopMonitoring();

    this.checkInterval = setInterval(() => {
      this.performHealthCheck().catch(error => {
        logger.error('Health check failed', error);
      });
    }, interval);

    // Run initial check
    this.performHealthCheck().catch(error => {
      logger.error('Initial health check failed', error);
    });

    logger.info('Health monitoring started');
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.info('Health monitoring stopped');
    }
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck() {
    try {
      const checks = {
        timestamp: Date.now(),
        memory: await this.checkMemory(),
        storage: await this.checkStorage(),
        capabilities: await this.checkCapabilities(),
        network: await this.checkNetwork(),
      };

      // Determine overall status
      const criticalIssues = Object.values(checks).filter(
        check => check && check.status === 'critical'
      );
      const warnings = Object.values(checks).filter(
        check => check && check.status === 'warning'
      );

      checks.overall = {
        status: criticalIssues.length > 0 ? 'critical' : warnings.length > 0 ? 'warning' : 'healthy',
        criticalIssues: criticalIssues.length,
        warnings: warnings.length,
      };

      this.checks = checks;
      this.lastCheck = Date.now();

      // Save health log
      await this.saveHealthLog(checks);

      return checks;
    } catch (error) {
      logger.error('Health check failed', error);
      throw error;
    }
  }

  /**
   * Check memory usage
   */
  async checkMemory() {
    try {
      if ('memory' in performance) {
        const memory = performance.memory;
        const used = memory.usedJSHeapSize;
        const limit = memory.jsHeapSizeLimit;
        const percentage = (used / limit) * 100;

        let status = 'healthy';
        if (percentage > CONFIG.MEMORY.GC_TRIGGER) {
          status = 'critical';
        } else if (percentage > CONFIG.MEMORY.WARNING_THRESHOLD) {
          status = 'warning';
        }

        return {
          status,
          used,
          limit,
          percentage: percentage.toFixed(2),
        };
      }
      return { status: 'unknown', message: 'Memory API not available' };
    } catch (error) {
      logger.warn('Memory check failed', error);
      return { status: 'unknown', error: error.message };
    }
  }

  /**
   * Check storage usage
   */
  async checkStorage() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage;
        const quota = estimate.quota;
        const percentage = (usage / quota) * 100;

        let status = 'healthy';
        if (percentage > 95) {
          status = 'critical';
        } else if (percentage > 80) {
          status = 'warning';
        }

        return {
          status,
          usage,
          quota,
          percentage: percentage.toFixed(2),
        };
      }
      return { status: 'unknown', message: 'Storage API not available' };
    } catch (error) {
      logger.warn('Storage check failed', error);
      return { status: 'unknown', error: error.message };
    }
  }

  /**
   * Check browser capabilities
   */
  async checkCapabilities() {
    try {
      const capabilities = {
        canvas2d: !!document.createElement('canvas').getContext('2d'),
        webCodecs: 'VideoEncoder' in window && 'VideoFrame' in window,
        audioContext: !!(window.AudioContext || window.webkitAudioContext),
        indexedDb: !!window.indexedDB,
        localStorage: !!window.localStorage,
        serviceWorker: 'serviceWorker' in navigator,
        mediaDevices: 'mediaDevices' in navigator,
      };

      const missing = Object.entries(capabilities)
        .filter(([_, v]) => !v)
        .map(([k]) => k);

      let status = 'healthy';
      if (missing.length > 0) {
        status = missing.length > 2 ? 'critical' : 'warning';
      }

      return {
        status,
        capabilities,
        missing,
      };
    } catch (error) {
      logger.warn('Capabilities check failed', error);
      return { status: 'unknown', error: error.message };
    }
  }

  /**
   * Check network connectivity
   */
  async checkNetwork() {
    try {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (!connection) {
        return { status: 'unknown', message: 'Connection API not available' };
      }

      let status = 'healthy';
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        status = 'warning';
      }

      return {
        status,
        type: connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    } catch (error) {
      logger.warn('Network check failed', error);
      return { status: 'unknown', error: error.message };
    }
  }

  /**
   * Save health log to storage
   */
  async saveHealthLog(checks) {
    try {
      const logEntry = {
        id: `health_${Date.now()}`,
        ...checks,
      };

      await storage.save('health_logs', logEntry);

      // Keep only last 1000 logs
      const allLogs = await storage.loadAll('health_logs');
      if (allLogs.length > 1000) {
        const toDelete = allLogs.slice(0, allLogs.length - 1000);
        for (const log of toDelete) {
          await storage.delete('health_logs', log.id);
        }
      }
    } catch (error) {
      logger.warn('Health log save failed', error);
    }
  }

  /**
   * Get current health status
   */
  getStatus() {
    return this.checks;
  }

  /**
   * Get health history
   */
  async getHistory(limit = 100) {
    try {
      const allLogs = await storage.loadAll('health_logs');
      return allLogs.slice(-limit);
    } catch (error) {
      logger.error('Failed to get health history', error);
      return [];
    }
  }
}

/**
 * Global health monitor instance
 */
export const healthMonitor = new HealthMonitor();

export default HealthMonitor;
