/**
 * AI Loop - Data Converters
 * Format conversion and data transformation utilities
 */

import { Logger } from './logger.js';

const logger = new Logger('Converters');

/**
 * Convert seconds to HH:MM:SS format
 */
export function secondsToTime(seconds) {
  if (typeof seconds !== 'number' || seconds < 0) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Convert bytes to human-readable format
 */
export function bytesToReadable(bytes) {
  if (typeof bytes !== 'number' || bytes < 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Convert frames to timestamp
 */
export function framesToTime(frame, fps = 30) {
  const seconds = frame / fps;
  return secondsToTime(seconds);
}

/**
 * Convert timestamp to milliseconds
 */
export function timeToMs(hours, minutes, seconds) {
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * Convert blob to data URL
 */
export async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert data URL to blob
 */
export function dataUrlToBlob(dataUrl) {
  const [header, data] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  
  const binaryString = atob(data);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: mime });
}

/**
 * Format video metadata
 */
export function formatVideoMetadata(metadata) {
  return {
    duration: secondsToTime(metadata.duration || 0),
    resolution: `${metadata.width}x${metadata.height}`,
    fps: metadata.fps || 30,
    bitrate: metadata.bitrate ? bytesToReadable(metadata.bitrate) : 'N/A',
    fileSize: metadata.fileSize ? bytesToReadable(metadata.fileSize) : 'N/A',
    createdAt: metadata.createdAt ? new Date(metadata.createdAt).toLocaleString() : 'N/A',
  };
}

/**
 * Parse video quality string
 */
export function parseQuality(qualityStr) {
  const qualityMap = {
    '720': '720p',
    '1080': '1080p',
    '2K': '2K',
    '4K': '4K',
  };
  return qualityMap[qualityStr] || qualityStr;
}

export default {
  secondsToTime,
  bytesToReadable,
  framesToTime,
  timeToMs,
  blobToDataUrl,
  dataUrlToBlob,
  formatVideoMetadata,
  parseQuality,
};
