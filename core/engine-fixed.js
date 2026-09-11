/**
 * AI Loop - Fixed Engine Module
 * Core animation rendering with bug fixes applied
 */

import CONFIG from '../config/constants.js';
import { Logger } from '../utils/logger.js';
import { MetricsCollector } from '../utils/metrics.js';

const logger = new Logger('RenderEngine');
const metrics = new MetricsCollector();

// Cache for scene cards and text metrics
const sceneCardCache = new Map();
const textMetricsCache = new Map();

/**
 * Seeded random number generator for consistent animations
 */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296);
  };
}

/**
 * Enhanced scene card with caching and all rendering data
 */
function buildSceneCard(sceneData, index) {
  // Check cache first (FIX: Performance optimization)
  const cacheKey = `scene_${index}_${sceneData.text.length}`;
  if (sceneCardCache.has(cacheKey)) {
    return { ...sceneCardCache.get(cacheKey), ...sceneData };
  }

  const rng = mulberry32(index * 97 + 13);
  
  const card = {
    ...sceneData,
    index,
    hue: 210 + index * 17,
    zoomDir: index % 2 === 0 ? 1 : -1,
    hillPoints: [],
    lights: [],
  };

  // Generate procedural hill layers
  for (let layer = 0; layer < CONFIG.ANIMATION.HILL_LAYERS; layer++) {
    const pts = [];
    const baseY = 0.62 + layer * 0.11;
    
    for (let p = 0; p <= 4; p++) {
      pts.push({
        x: p / 4,
        y: baseY + (rng() - 0.5) * 0.06,
      });
    }
    card.hillPoints.push(pts);
  }

  // Generate flickering lights
  const lightCount = CONFIG.ANIMATION.LIGHT_COUNT_MIN + 
    Math.floor(rng() * (CONFIG.ANIMATION.LIGHT_COUNT_MAX - CONFIG.ANIMATION.LIGHT_COUNT_MIN));
  
  for (let l = 0; l < lightCount; l++) {
    card.lights.push({
      x: rng(),
      y: 0.66 + rng() * 0.08,
      phase: rng() * Math.PI * 2,
      speed: 1.5 + rng() * 1.5,
    });
  }

  // Cache the card (FIX: Keep cache size reasonable)
  if (sceneCardCache.size > 1000) {
    const firstKey = sceneCardCache.keys().next().value;
    sceneCardCache.delete(firstKey);
  }
  sceneCardCache.set(cacheKey, card);

  return card;
}

/**
 * Draw a single hill layer with smooth curves
 */
function drawHillLayer(ctx, points, shade, width, height) {
  ctx.beginPath();
  ctx.moveTo(0, points[0].y * height);
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = ((p0.x + p1.x) / 2) * width;
    const cy = ((p0.y + p1.y) / 2) * height;
    
    ctx.quadraticCurveTo(p0.x * width, p0.y * height, cx, cy);
  }
  
  ctx.lineTo(points[points.length - 1].x * width, points[points.length - 1].y * height);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  
  ctx.fillStyle = shade;
  ctx.fill();
}

/**
 * Wrap text to fit within max width (with caching)
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    
    // FIX: Cache text measurements
    const cacheKey = `${testLine}_${ctx.font}_${maxWidth}`;
    let metrics;
    
    if (textMetricsCache.has(cacheKey)) {
      metrics = textMetricsCache.get(cacheKey);
    } else {
      metrics = ctx.measureText(testLine);
      textMetricsCache.set(cacheKey, metrics);
      
      // Keep cache size reasonable
      if (textMetricsCache.size > 500) {
        const firstKey = textMetricsCache.keys().next().value;
        textMetricsCache.delete(firstKey);
      }
    }
    
    if (metrics.width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  
  if (line) lines.push(line);
  return lines;
}

/**
 * Main rendering engine class
 */
export class RenderEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.initializeContext(); // FIX: Initialize context safely
    this.isRendering = false;
    this.renderStartTime = null;
    this.totalFramesRendered = 0;
    
    // FIX: Listen for context loss (Mobile Safari issue)
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      logger.warn('Canvas context lost, attempting recovery');
      this.initializeContext();
    });
  }

  /**
   * Initialize canvas context safely
   */
  initializeContext() {
    try {
      this.ctx = this.canvas.getContext('2d', {
        willReadFrequently: true,
      });
      if (!this.ctx) {
        throw new Error('Failed to get 2D context');
      }
    } catch (error) {
      logger.error('Context initialization failed', error);
      throw error;
    }
  }

  /**
   * Initialize rendering for a set of scenes
   */
  async initialize(scenes, options = {}) {
    try {
      const startTime = performance.now();
      
      // FIX: Responsive canvas sizing for mobile
      const devicePixelRatio = window.devicePixelRatio || 1;
      let width = options.width || CONFIG.QUALITY_PRESETS['1080'].width;
      const maxWidth = window.innerWidth * 0.95;
      
      if (width > maxWidth) {
        width = Math.floor(maxWidth / devicePixelRatio);
      }
      
      const height = Math.round(width * 9 / 16);
      
      // Set canvas resolution and display size
      this.canvas.width = width * devicePixelRatio;
      this.canvas.height = height * devicePixelRatio;
      this.ctx.scale(devicePixelRatio, devicePixelRatio);
      
      // CSS styling
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      
      this.scenes = scenes.map((scene, idx) => buildSceneCard(scene, idx));
      this.options = {
        width,
        height,
        fps: options.fps || CONFIG.RENDER.FPS,
        ...options,
      };
      
      const duration = performance.now() - startTime;
      logger.info(`Engine initialized in ${duration.toFixed(2)}ms`);
      metrics.recordMetric('engine_init_time', duration);
      
      return true;
    } catch (error) {
      logger.error('Engine initialization failed', error);
      throw error;
    }
  }

  /**
   * Find which scene should be rendered at a given time
   */
  findSceneAt(elapsed) {
    let accumulated = 0;
    
    for (let i = 0; i < this.scenes.length; i++) {
      const scene = this.scenes[i];
      if (elapsed < accumulated + scene.seconds) {
        return {
          scene,
          index: i,
          timeInScene: elapsed - accumulated,
          totalTime: scene.seconds,
        };
      }
      accumulated += scene.seconds;
    }
    
    const lastScene = this.scenes[this.scenes.length - 1];
    return {
      scene: lastScene,
      index: this.scenes.length - 1,
      timeInScene: lastScene.seconds,
      totalTime: lastScene.seconds,
    };
  }

  /**
   * Render frame for a specific scene at a specific time
   */
  renderFrame(sceneInfo, globalTime, ambientParticles) {
    const W = this.options.width;
    const H = this.options.height;
    const scene = sceneInfo.scene;
    const timeInScene = sceneInfo.timeInScene;
    const totalTime = sceneInfo.totalTime;

    // Background gradient based on hue
    const bgGradient = this.ctx.createLinearGradient(0, 0, 0, H);
    bgGradient.addColorStop(0, `hsl(${scene.hue}, 40%, 9%)`);
    bgGradient.addColorStop(0.6, `hsl(${scene.hue + 10}, 45%, 6%)`);
    bgGradient.addColorStop(1, `hsl(${scene.hue + 20}, 40%, 3%)`);
    
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, W, H);

    // Apply zoom and pan based on scene progress
    const progress = Math.min(1, timeInScene / Math.max(totalTime, 1));
    const zoom = 1 + CONFIG.ANIMATION.ZOOM_AMOUNT * progress;
    const panX = scene.zoomDir * progress * W * CONFIG.ANIMATION.PAN_AMOUNT;
    
    this.ctx.save();
    this.ctx.translate(W / 2 + panX, H / 2);
    this.ctx.scale(zoom, zoom);
    this.ctx.translate(-W / 2, -H / 2);

    // Draw hill layers
    const shades = [
      'rgba(10,8,7,0.9)',
      'rgba(6,5,4,0.95)',
      'rgba(2,2,2,1)',
    ];
    
    scene.hillPoints.forEach((pts, layerIdx) => {
      drawHillLayer(this.ctx, pts, shades[layerIdx], W, H);
    });

    // Draw flickering lights
    scene.lights.forEach(light => {
      const flicker = 0.5 + 0.5 * Math.sin(globalTime * light.speed + light.phase);
      const r = 3 + flicker * 2.5;
      const gx = light.x * W;
      const gy = light.y * H;
      
      // Light glow
      const radiusGradient = this.ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 6);
      radiusGradient.addColorStop(0, `rgba(255,200,120,${0.5 + 0.3 * flicker})`);
      radiusGradient.addColorStop(1, 'rgba(255,200,120,0)');
      
      this.ctx.fillStyle = radiusGradient;
      this.ctx.beginPath();
      this.ctx.arc(gx, gy, r * 6, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Light core
      this.ctx.fillStyle = `rgba(255,225,170,${0.7 + 0.3 * flicker})`;
      this.ctx.beginPath();
      this.ctx.arc(gx, gy, r * 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.restore();

    // Draw mist layer
    const mistY = H * 0.72 + Math.sin(globalTime * 0.15) * H * 0.02;
    const mistGradient = this.ctx.createLinearGradient(
      0, mistY - H * 0.08,
      0, mistY + H * 0.12
    );
    mistGradient.addColorStop(0, 'rgba(200,200,210,0)');
    mistGradient.addColorStop(0.5, `rgba(200,200,210,${CONFIG.ANIMATION.MIST_OPACITY})`);
    mistGradient.addColorStop(1, 'rgba(200,200,210,0)');
    
    this.ctx.fillStyle = mistGradient;
    this.ctx.fillRect(0, mistY - H * 0.08, W, H * 0.2);

    // Draw ambient particles
    if (ambientParticles && ambientParticles.length > 0) {
      this.drawParticles(ambientParticles, globalTime, W, H);
    }

    // Draw text with fade in/out
    const fadeInTime = CONFIG.SCENE.FADE_IN_DURATION;
    const fadeOutTime = CONFIG.SCENE.FADE_OUT_DURATION;
    const fadeInProgress = Math.min(1, timeInScene / fadeInTime);
    const fadeOutProgress = Math.min(1, (totalTime - timeInScene) / fadeOutTime);
    const alpha = Math.max(0, Math.min(fadeInProgress, fadeOutProgress));

    if (alpha > 0.01) {
      this.drawSceneText(scene.text, W, H, alpha);
    }
  }

  /**
   * Draw ambient particles
   */
  drawParticles(particles, globalTime, W, H) {
    particles.forEach(particle => {
      const yOffset = ((particle.y - (globalTime * particle.speed / 1000)) % 1 + 1) % 1;
      const xOffset = (particle.x + Math.sin(globalTime * 0.3 + particle.phase) * 0.01 + 1) % 1;
      
      const twinkle = 0.5 + 0.5 * Math.sin(globalTime * 2 + particle.phase * 5);
      
      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(230,200,150,${particle.alpha * twinkle})`;
      this.ctx.shadowColor = 'rgba(230,200,150,0.6)';
      this.ctx.shadowBlur = 6;
      this.ctx.arc(xOffset * W, yOffset * H, particle.r, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.shadowBlur = 0;
  }

  /**
   * Draw scene text with proper formatting
   */
  drawSceneText(text, W, H, alpha) {
    // Dark scrim at bottom
    const scrimH = H * 0.28;
    const scrimGradient = this.ctx.createLinearGradient(0, H - scrimH, 0, H);
    scrimGradient.addColorStop(0, 'rgba(10,8,7,0)');
    scrimGradient.addColorStop(1, `rgba(10,8,7,${CONFIG.ANIMATION.SCRIM_OPACITY * alpha})`);
    
    this.ctx.fillStyle = scrimGradient;
    this.ctx.fillRect(0, H - scrimH, W, scrimH);

    // Text
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = CONFIG.COLORS.INK;
    this.ctx.font = `600 ${Math.round(W * CONFIG.TEXT.FONT_SIZE_SCALE)}px ${CONFIG.TEXT.PRIMARY_FONT}, ${CONFIG.TEXT.FALLBACK_FONT}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const maxWidth = W * CONFIG.TEXT.MAX_TEXT_WIDTH;
    const lines = wrapText(this.ctx, text, maxWidth);
    const lineHeight = W * 0.07;
    const startY = H - scrimH * 0.5 - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, idx) => {
      this.ctx.fillText(line, W / 2, startY + idx * lineHeight);
    });
    
    this.ctx.restore();
  }

  /**
   * Get total duration of all scenes
   */
  getTotalDuration() {
    if (!this.scenes) return 0;
    return this.scenes.reduce((sum, scene) => sum + scene.seconds, 0);
  }

  /**
   * Check if rendering is supported
   */
  static isSupported() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('2d') && canvas.getContext('2d').canvas);
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if WebCodecs is supported
   */
  static async supportsWebCodecs() {
    try {
      return ('VideoEncoder' in window) && 
             ('VideoFrame' in window) &&
             ('AudioEncoder' in window);
    } catch (error) {
      return false;
    }
  }
}

/**
 * Create ambient particles for visual effects
 */
export function createAmbientParticles(count) {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2.2,
      speed: CONFIG.ANIMATION.PARTICLE_MIN_SPEED + Math.random() * 
             (CONFIG.ANIMATION.PARTICLE_MAX_SPEED - CONFIG.ANIMATION.PARTICLE_MIN_SPEED),
      alpha: 0.1 + Math.random() * 0.22,
      phase: Math.random() * 10,
    });
  }
  
  return particles;
}

export default RenderEngine;
