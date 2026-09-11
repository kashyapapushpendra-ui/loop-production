/**
 * AI Loop - Self-Healing System
 * Automatic error detection and recovery
 */

import CONFIG from '../config/constants.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('SelfHealer');

/**
 * Self-Healing System Class
 */
export class SelfHealer {
  constructor() {
    this.issues = [];
    this.recoveryAttempts = 0;
    this.maxRecoveryAttempts = 3;
  }

  /**
   * Detect common issues
   */
  async detectIssues() {
    const detectedIssues = [];

    // Memory check
    if ('memory' in performance) {
      const memUsage = performance.memory.usedJSHeapSize;
      const memLimit = performance.memory.jsHeapSizeLimit;
      const memPercentage = (memUsage / memLimit) * 100;

      if (memPercentage > CONFIG.MEMORY.GC_TRIGGER) {
        detectedIssues.push({
          type: 'HIGH_MEMORY',
          severity: 'critical',
          message: `Memory usage at ${memPercentage.toFixed(1)}%`,
          data: { usage: memUsage, limit: memLimit },
        });
      } else if (memPercentage > CONFIG.MEMORY.WARNING_THRESHOLD) {
        detectedIssues.push({
          type: 'MEMORY_WARNING',
          severity: 'warning',
          message: `Memory usage at ${memPercentage.toFixed(1)}%`,
          data: { usage: memUsage, limit: memLimit },
        });
      }
    }

    // Storage check
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const storagePercentage = (estimate.usage / estimate.quota) * 100;

        if (storagePercentage > 90) {
          detectedIssues.push({
            type: 'STORAGE_FULL',
            severity: 'critical',
            message: `Storage usage at ${storagePercentage.toFixed(1)}%`,
            data: { usage: estimate.usage, quota: estimate.quota },
          });
        }
      }
    } catch (error) {
      logger.warn('Storage estimation failed', error);
    }

    // Network check
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        detectedIssues.push({
          type: 'SLOW_NETWORK',
          severity: 'warning',
          message: `Slow network detected: ${connection.effectiveType}`,
          data: { effectiveType: connection.effectiveType },
        });
      }
    }

    this.issues = detectedIssues;
    return detectedIssues;
  }

  /**
   * Attempt automatic recovery
   */
  async attemptRecovery(issue) {
    logger.info('Attempting recovery', { type: issue.type });
    this.recoveryAttempts++;

    try {
      switch (issue.type) {
        case 'HIGH_MEMORY':
          return await this.recoverHighMemory();
        
        case 'MEMORY_WARNING':
          return await this.cleanupMemory();
        
        case 'STORAGE_FULL':
          return await this.cleanupStorage();
        
        case 'SLOW_NETWORK':
          return await this.handleSlowNetwork();
        
        default:
          logger.warn('Unknown issue type', { type: issue.type });
          return { recovered: false, message: 'Unknown issue type' };
      }
    } catch (error) {
      logger.error('Recovery failed', error);
      return { recovered: false, message: error.message };
    }
  }

  /**
   * Recover from high memory usage
   */
  async recoverHighMemory() {
    try {
      // Force garbage collection by clearing caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Clear IndexedDB cache
      // (Implementation in services/cache-manager.js)
      
      logger.info('High memory recovery attempted');
      return { recovered: true, message: 'Memory cleanup completed' };
    } catch (error) {
      return { recovered: false, message: error.message };
    }
  }

  /**
   * Cleanup memory
   */
  async cleanupMemory() {
    try {
      // Clear unused resources
      const imageElements = document.querySelectorAll('img[data-cached]');
      imageElements.forEach(img => {
        img.src = '';
        img.removeAttribute('data-cached');
      });

      logger.info('Memory cleanup completed');
      return { recovered: true, message: 'Memory optimized' };
    } catch (error) {
      return { recovered: false, message: error.message };
    }
  }

  /**
   * Cleanup storage
   */
  async cleanupStorage() {
    try {
      // Clear old cache entries
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const now = Date.now();
        
        for (const name of cacheNames) {
          const cache = await caches.open(name);
          const requests = await cache.keys();
          
          for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
              const dateHeader = response.headers.get('date');
              if (dateHeader) {
                const responseDate = new Date(dateHeader).getTime();
                if (now - responseDate > 24 * 60 * 60 * 1000) { // 24 hours
                  await cache.delete(request);
                }
              }
            }
          }
        }
      }

      logger.info('Storage cleanup completed');
      return { recovered: true, message: 'Storage cleaned' };
    } catch (error) {
      return { recovered: false, message: error.message };
    }
  }

  /**
   * Handle slow network
   */
  async handleSlowNetwork() {
    logger.info('Reducing quality for slow network');
    // Quality reduction handled in rendering engine
    return { recovered: true, message: 'Quality reduced for slow network' };
  }

  /**
   * Auto-recover critical issues
   */
  async autoRecover() {
    const issues = await this.detectIssues();
    const criticalIssues = issues.filter(i => i.severity === 'critical');

    for (const issue of criticalIssues) {
      if (this.recoveryAttempts < this.maxRecoveryAttempts) {
        const result = await this.attemptRecovery(issue);
        if (result.recovered) {
          logger.info('Issue recovered', { type: issue.type });
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get health report
   */
  async getHealthReport() {
    const issues = await this.detectIssues();
    const status = issues.length === 0 ? 'healthy' : issues[0].severity;

    return {
      status,
      timestamp: new Date().toISOString(),
      issues,
      recoveryAttempts: this.recoveryAttempts,
    };
  }
}

export default SelfHealer;
