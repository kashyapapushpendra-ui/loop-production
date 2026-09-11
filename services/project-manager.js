/**
 * AI Loop - Project Manager
 * Manages project persistence, save/load functionality
 */

import { storage } from './storage.js';
import { Logger } from '../utils/logger.js';
import { MetricsCollector } from '../utils/metrics.js';

const logger = new Logger('ProjectManager');
const metrics = new MetricsCollector();

/**
 * Project Manager Class
 */
export class ProjectManager {
  constructor() {
    this.currentProject = null;
    this.autoSaveTimer = null;
  }

  /**
   * Create new project
   */
  async createProject(data = {}) {
    try {
      const project = {
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name || 'Untitled Project',
        description: data.description || '',
        story: data.story || '',
        scenes: data.scenes || [],
        metadata: {
          title: data.title || '',
          duration: data.duration || 5,
          quality: data.quality || '1080',
          audioMode: data.audioMode || 'silent',
          aspectRatio: data.aspectRatio || '16:9',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1,
      };

      this.currentProject = project;
      await storage.save('projects', project);

      logger.info('Project created', { id: project.id, name: project.name });
      metrics.recordMetric('project_created', 1);

      return project;
    } catch (error) {
      logger.error('Project creation failed', error);
      throw error;
    }
  }

  /**
   * Save current project
   */
  async saveProject(projectData = null) {
    try {
      const project = projectData || this.currentProject;
      if (!project || !project.id) {
        throw new Error('No project to save');
      }

      project.updatedAt = Date.now();
      await storage.save('projects', project);

      logger.info('Project saved', { id: project.id });
      metrics.recordMetric('project_saved', 1);

      return project;
    } catch (error) {
      logger.error('Project save failed', error);
      throw error;
    }
  }

  /**
   * Load project by ID
   */
  async loadProject(projectId) {
    try {
      const project = await storage.load('projects', projectId);
      if (!project) {
        throw new Error(`Project not found: ${projectId}`);
      }

      this.currentProject = project;
      logger.info('Project loaded', { id: projectId });
      metrics.recordMetric('project_loaded', 1);

      return project;
    } catch (error) {
      logger.error('Project load failed', error);
      throw error;
    }
  }

  /**
   * List all projects
   */
  async listProjects() {
    try {
      const projects = await storage.loadAll('projects');
      return projects.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      logger.error('Project listing failed', error);
      return [];
    }
  }

  /**
   * Delete project
   */
  async deleteProject(projectId) {
    try {
      await storage.delete('projects', projectId);
      if (this.currentProject?.id === projectId) {
        this.currentProject = null;
      }
      logger.info('Project deleted', { id: projectId });
      metrics.recordMetric('project_deleted', 1);
    } catch (error) {
      logger.error('Project deletion failed', error);
      throw error;
    }
  }

  /**
   * Update project
   */
  async updateProject(projectId, updates) {
    try {
      let project = await storage.load('projects', projectId);
      if (!project) {
        throw new Error(`Project not found: ${projectId}`);
      }

      project = {
        ...project,
        ...updates,
        id: projectId, // Preserve ID
        updatedAt: Date.now(),
      };

      await storage.save('projects', project);
      if (this.currentProject?.id === projectId) {
        this.currentProject = project;
      }

      logger.info('Project updated', { id: projectId });
      return project;
    } catch (error) {
      logger.error('Project update failed', error);
      throw error;
    }
  }

  /**
   * Start auto-save
   */
  startAutoSave(interval = 30000) {
    this.stopAutoSave();

    this.autoSaveTimer = setInterval(async () => {
      if (this.currentProject) {
        try {
          await this.saveProject();
          logger.debug('Auto-save completed');
        } catch (error) {
          logger.error('Auto-save failed', error);
        }
      }
    }, interval);

    logger.info('Auto-save started', { interval });
  }

  /**
   * Stop auto-save
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
      logger.info('Auto-save stopped');
    }
  }

  /**
   * Export project as JSON
   */
  async exportProject(projectId) {
    try {
      const project = await storage.load('projects', projectId);
      if (!project) {
        throw new Error(`Project not found: ${projectId}`);
      }

      const json = JSON.stringify(project, null, 2);
      return new Blob([json], { type: 'application/json' });
    } catch (error) {
      logger.error('Project export failed', error);
      throw error;
    }
  }

  /**
   * Import project from JSON
   */
  async importProject(blob) {
    try {
      const text = await blob.text();
      const project = JSON.parse(text);

      // Generate new ID to avoid conflicts
      project.id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      project.importedAt = Date.now();

      await storage.save('projects', project);
      logger.info('Project imported', { id: project.id });

      return project;
    } catch (error) {
      logger.error('Project import failed', error);
      throw error;
    }
  }
}

/**
 * Global project manager instance
 */
export const projectManager = new ProjectManager();

export default ProjectManager;
