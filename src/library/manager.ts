/**
 * Library Manager - Handles knowledge article CRUD operations
 */

import { readFile, writeFile, readdir, mkdir } from 'fs/promises';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import type { KnowledgeArticle, LibraryQuery } from '../types.js';
import { appConfig } from '../config.js';
import { logger } from '../utils/logger.js';

export class LibraryManager {
  private libraryPath: string;

  constructor() {
    this.libraryPath = resolve(appConfig.library.path);
  }

  /**
   * Initialize the library structure
   */
  async initialize(): Promise<void> {
    const dirs = [
      this.libraryPath,
      join(this.libraryPath, 'categories'),
      join(this.libraryPath, 'metadata'),
      join(this.libraryPath, 'requirements', 'PRDs'),
      join(this.libraryPath, 'guidelines'),
    ];

    for (const dir of dirs) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
        logger.info(`Created directory: ${dir}`);
      }
    }
  }

  /**
   * Save an article to the library
   */
  async saveArticle(article: KnowledgeArticle): Promise<void> {
    const categoryPath = join(
      this.libraryPath,
      'categories',
      article.category
    );

    if (!existsSync(categoryPath)) {
      await mkdir(categoryPath, { recursive: true });
    }

    const filePath = join(categoryPath, `${article.id}.json`);
    await writeFile(filePath, JSON.stringify(article, null, 2), 'utf-8');
    logger.info(`Saved article: ${article.title}`);
  }

  /**
   * Load an article by ID and category
   */
  async loadArticle(
    id: string,
    category: string
  ): Promise<KnowledgeArticle | null> {
    try {
      const filePath = join(
        this.libraryPath,
        'categories',
        category,
        `${id}.json`
      );
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content) as KnowledgeArticle;
    } catch {
      return null;
    }
  }

  /**
   * List all articles in a category
   */
  async listArticles(category?: string): Promise<KnowledgeArticle[]> {
    const articles: KnowledgeArticle[] = [];
    const categoriesDir = join(this.libraryPath, 'categories');

    const categories = category
      ? [category]
      : await this.getDirectories(categoriesDir);

    for (const cat of categories) {
      const catPath = join(categoriesDir, cat);
      if (!existsSync(catPath)) continue;

      const files = await readdir(catPath);
      for (const file of files.filter((f) => f.endsWith('.json'))) {
        try {
          const content = await readFile(
            join(catPath, file),
            'utf-8'
          );
          articles.push(JSON.parse(content) as KnowledgeArticle);
        } catch (error) {
          logger.error(`Failed to load article ${file}:`, error);
        }
      }
    }

    return articles;
  }

  /**
   * Search articles by query (simple text search)
   */
  async searchArticles(query: LibraryQuery): Promise<KnowledgeArticle[]> {
    const articles = await this.listArticles(query.category);

    return articles
      .filter((article) => {
        const matchesQuery =
          article.title.toLowerCase().includes(query.query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.query.toLowerCase());

        const matchesTags =
          !query.tags ||
          query.tags.some((tag) => article.tags.includes(tag));

        return matchesQuery && matchesTags;
      })
      .slice(0, query.limit || 10);
  }

  private async getDirectories(dir: string): Promise<string[]> {
    if (!existsSync(dir)) return [];

    const entries = await readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  }
}
