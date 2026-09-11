/**
 * AI Loop - Cache Manager
 * Manages caching of scenes, renders, and media
 */

import { storage } from './storage.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('CacheManager');

/**
 * Cache Manager Class
 */
export class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.maxMemoryCacheSize = 50; // entries
    this.maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Get from cache (memory first, then IndexedDB)
   */
  async get(key) {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      const item = this.memoryCache.get(key);
      if (Date.now() - item.timestamp < this.maxCacheAge) {
        return item.value;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Check IndexedDB cache
    try {
      const cached = await storage.load('cache', key);
      if (cached && Date.now() - cached.timestamp < this.maxCacheAge) {
        return cached.value;
      } else if (cached) {
        await storage.delete('cache', key);
      }
    } catch (error) {
      logger.warn('Cache get failed', error);
    }

    return null;
  }

  /**
   * Set cache item
   */
  async set(key, value, ttl = this.maxCacheAge) {
    try {
      const item = {
        id: key,
        value,
        timestamp: Date.now(),
        ttl,
      };

      // Store in memory cache
      this.memoryCache.set(key, item);

      // Limit memory cache size
      if (this.memoryCache.size > this.maxMemoryCacheSize) {
        const firstKey = this.memoryCache.keys().next().value;
        this.memoryCache.delete(firstKey);
      }

      // Store in IndexedDB
      await storage.save('cache', item);
    } catch (error) {
      logger.error('Cache set failed', error);
    }
  }

  /**
   * Delete cache item
   */
  async delete(key) {
    this.memoryCache.delete(key);
    try {
      await storage.delete('cache', key);
    } catch (error) {
      logger.warn('Cache delete failed', error);
    }
  }

  /**
   * Clear all cache
   */
  async clearAll() {
    this.memoryCache.clear();
    try {
      await storage.clear('cache');
      logger.info('Cache cleared');
    } catch (error) {
      logger.error('Cache clear failed', error);
    }
  }

  /**
   * Clean expired cache entries
   */
  async cleanup() {
    try {
      const now = Date.now();
      const allCache = await storage.loadAll('cache');
      const toDelete = allCache.filter(item => now - item.timestamp > item.ttl);

      for (const item of toDelete) {
        await storage.delete('cache', item.id);
      }

      logger.info('Cache cleanup completed', { deleted: toDelete.length });
      return toDelete.length;
    } catch (error) {
      logger.error('Cache cleanup failed', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    try {
      const allCache = await storage.loadAll('cache');
      const now = Date.now();
      const expired = allCache.filter(item => now - item.timestamp > item.ttl);
      const valid = allCache.length - expired.length;

      return {
        memory: this.memoryCache.size,
        disk: valid,
        total: allCache.length,
        expired: expired.length,
        size: JSON.stringify(allCache).length,
      };
    } catch (error) {
      logger.error('Failed to get cache stats', error);
      return {};
    }
  }
}

/**
 * Global cache manager instance
 */
export const cacheManager = new CacheManager();

export default CacheManager;
