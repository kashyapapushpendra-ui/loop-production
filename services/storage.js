/**
 * AI Loop - IndexedDB Storage Service
 * Persistent storage management for projects and cache
 */

import CONFIG from '../config/constants.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('StorageService');

/**
 * Storage Service Class
 */
export class StorageService {
  constructor() {
    this.db = null;
    this.isReady = false;
  }

  /**
   * Initialize IndexedDB
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CONFIG.STORAGE.DB_NAME, CONFIG.STORAGE.DB_VERSION);

      request.onerror = () => {
        logger.error('IndexedDB initialization failed', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isReady = true;
        logger.info('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        CONFIG.STORAGE.STORES.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            logger.info(`Created object store: ${storeName}`);
          }
        });
      };
    });
  }

  /**
   * Check if storage is available
   */
  async checkAvailability() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage;
        const quota = estimate.quota;
        const percentage = (usage / quota) * 100;

        return {
          available: true,
          usage,
          quota,
          percentage,
          warning: percentage > 80,
          critical: percentage > 95,
        };
      }
      return { available: false };
    } catch (error) {
      logger.warn('Storage availability check failed', error);
      return { available: false };
    }
  }

  /**
   * Save data to IndexedDB
   */
  async save(storeName, data) {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        reject(new Error('Storage not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const record = {
        ...data,
        timestamp: Date.now(),
      };

      const request = store.put(record);

      request.onerror = () => {
        logger.error(`Failed to save to ${storeName}`, request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        logger.debug(`Saved to ${storeName}`, { id: record.id });
        resolve(record);
      };
    });
  }

  /**
   * Load data from IndexedDB
   */
  async load(storeName, id) {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        reject(new Error('Storage not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => {
        logger.error(`Failed to load from ${storeName}`, request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result || null);
      };
    });
  }

  /**
   * Load all records from a store
   */
  async loadAll(storeName) {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        reject(new Error('Storage not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => {
        logger.error(`Failed to load all from ${storeName}`, request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result || []);
      };
    });
  }

  /**
   * Delete from IndexedDB
   */
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        reject(new Error('Storage not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => {
        logger.error(`Failed to delete from ${storeName}`, request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        logger.debug(`Deleted from ${storeName}`, { id });
        resolve();
      };
    });
  }

  /**
   * Clear entire store
   */
  async clear(storeName) {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        reject(new Error('Storage not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => {
        logger.error(`Failed to clear ${storeName}`, request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        logger.info(`Cleared store: ${storeName}`);
        resolve();
      };
    });
  }

  /**
   * Query by index
   */
  async query(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      if (!this.isReady) {
        reject(new Error('Storage not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      const stats = {};
      for (const storeName of CONFIG.STORAGE.STORES) {
        const records = await this.loadAll(storeName);
        stats[storeName] = {
          count: records.length,
          size: JSON.stringify(records).length,
        };
      }
      return stats;
    } catch (error) {
      logger.error('Failed to get storage stats', error);
      return {};
    }
  }
}

/**
 * Global storage instance
 */
export const storage = new StorageService();

export default StorageService;
