/**
 * AI Loop - Metrics Collector
 * Performance and usage tracking
 */

import CONFIG from '../config/constants.js';

/**
 * Metrics Collector Class
 */
export class MetricsCollector {
  constructor() {
    this.metrics = {};
    this.startTimes = {};
  }

  /**
   * Start timing a metric
   */
  startTimer(key) {
    this.startTimes[key] = performance.now();
  }

  /**
   * End timing and record metric
   */
  endTimer(key) {
    if (!this.startTimes[key]) {
      console.warn(`Timer for ${key} not started`);
      return null;
    }

    const duration = performance.now() - this.startTimes[key];
    delete this.startTimes[key];
    this.recordMetric(key, duration);
    return duration;
  }

  /**
   * Record a metric value
   */
  recordMetric(key, value) {
    if (!this.metrics[key]) {
      this.metrics[key] = [];
    }
    this.metrics[key].push({
      value,
      timestamp: Date.now(),
    });

    // Keep only last 1000 entries per metric
    if (this.metrics[key].length > 1000) {
      this.metrics[key].shift();
    }
  }

  /**
   * Get metric statistics
   */
  getMetricStats(key) {
    if (!this.metrics[key] || this.metrics[key].length === 0) {
      return null;
    }

    const values = this.metrics[key].map(m => m.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const latest = values[values.length - 1];

    return { min, max, avg, latest, count: values.length };
  }

  /**
   * Get all metrics
   */
  getAllMetrics() {
    const report = {};
    for (const [key] of Object.entries(this.metrics)) {
      report[key] = this.getMetricStats(key);
    }
    return report;
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    const memoryUsage = this.getMemoryUsage();
    const navTiming = this.getNavigationTiming();

    return {
      timestamp: new Date().toISOString(),
      memory: memoryUsage,
      navigation: navTiming,
      metrics: this.getAllMetrics(),
    };
  }

  /**
   * Get memory usage
   */
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        used: memory.usedJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        total: memory.totalJSHeapSize,
        percentage: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2),
      };
    }
    return null;
  }

  /**
   * Get navigation timing
   */
  getNavigationTiming() {
    if ('navigation' in window.performance) {
      const timing = window.performance.timing;
      return {
        navigationStart: timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: timing.responseEnd - timing.navigationStart,
      };
    }
    return null;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = {};
    this.startTimes = {};
  }
}

export default MetricsCollector;
