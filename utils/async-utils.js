/**
 * AI Loop - Async Utilities
 * Helper functions for async operations and retries
 */

import CONFIG from '../config/constants.js';
import { Logger } from './logger.js';

const logger = new Logger('AsyncUtils');

/**
 * Retry async operation with exponential backoff
 */
export async function retryAsync(
  fn,
  maxAttempts = CONFIG.API.RETRY_ATTEMPTS,
  baseDelay = CONFIG.API.RETRY_DELAY
) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, { error: error.message });
        await sleep(delay);
      } else {
        logger.error(`All ${maxAttempts} attempts failed`, error);
      }
    }
  }

  throw lastError;
}

/**
 * Sleep for specified duration
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Timeout wrapper for promises
 */
export async function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Debounce function calls
 */
export function debounce(fn, delay) {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function calls
 */
export function throttle(fn, interval) {
  let lastCall = 0;
  
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Batch async operations
 */
export async function batch(operations, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch);
    results.push(...batchResults);
  }
  
  return results;
}

export default {
  retryAsync,
  sleep,
  withTimeout,
  debounce,
  throttle,
  batch,
};
