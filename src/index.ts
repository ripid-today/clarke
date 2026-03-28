/**
 * Clarke's Library - Main Entry Point
 *
 * Multi-agent knowledge library system using Claude Agent SDK.
 */

import { LibraryManager } from './library/manager.js';
import { VectorStore } from './library/vectorStore.js';
import { AgentOrchestrator, createAgent } from './agents/index.js';
import { validateConfig, appConfig } from './config.js';
import { logger } from './utils/logger.js';
import { agentConfigs } from './agents/factory.js';
import type { AgentTask, KnowledgeArticle } from './types.js';

class ClarkesLibrary {
  library: LibraryManager;
  vectorStore: VectorStore;
  orchestrator: AgentOrchestrator;

  constructor() {
    this.library = new LibraryManager();
    this.vectorStore = new VectorStore();
    this.orchestrator = new AgentOrchestrator();
  }

  /**
   * Initialize the library system
   */
  async initialize(): Promise<void> {
    logger.info('Initializing Clarke\'s Library...');

    // Validate configuration
    validateConfig();

    // Initialize library structure
    await this.library.initialize();

    // Initialize vector store (optional - requires API key)
    try {
      await this.vectorStore.initialize();
    } catch {
      logger.warn('Vector store not available - semantic search disabled');
    }

    // Register agents
    for (const [name, config] of Object.entries(agentConfigs)) {
      const agent = createAgent(config);
      this.orchestrator.registerAgent(name, agent);
    }

    logger.info('Clarke\'s Library initialized successfully');
  }

  /**
   * Add a knowledge article to the library
   */
  async addArticle(article: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<KnowledgeArticle> {
    const now = new Date();
    const fullArticle: KnowledgeArticle = {
      ...article,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };

    await this.library.saveArticle(fullArticle);

    // If vector store is available, index the article
    if (this.vectorStore.isAvailable()) {
      logger.info('Indexing article in vector store (placeholder)');
      // Vector indexing would go here - requires embeddings
    }

    return fullArticle;
  }

  /**
   * Process a task through the agent orchestrator
   */
  async processTask(type: AgentTask['type'], input: string, context?: Record<string, unknown>): Promise<string> {
    const task: AgentTask = {
      id: this.generateId(),
      type,
      input,
      context,
      priority: 'medium',
      status: 'pending',
      createdAt: new Date(),
    };

    // Assess confidence
    const confidence = this.orchestrator.assessConfidence(task);
    logger.info(`Task confidence: ${confidence}`);

    if (confidence < 0.7) {
      throw new Error('Task confidence too low - need more context');
    }

    return this.orchestrator.routeTask(task);
  }

  /**
   * Search the library
   */
  async search(query: string, category?: string): Promise<KnowledgeArticle[]> {
    return this.library.searchArticles({
      query,
      category,
      limit: 10,
    });
  }

  /**
   * List all articles
   */
  async listArticles(category?: string): Promise<KnowledgeArticle[]> {
    return this.library.listArticles(category);
  }

  /**
   * Get system status
   */
  getStatus(): {
    initialized: boolean;
    vectorStoreAvailable: boolean;
    agents: string[];
    libraryPath: string;
  } {
    return {
      initialized: true,
      vectorStoreAvailable: this.vectorStore.isAvailable(),
      agents: this.orchestrator.getAvailableAgents(),
      libraryPath: appConfig.library.path,
    };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Export the main class and types
export { ClarkesLibrary };
export * from './types.js';
export * from './config.js';

// Main execution (when run directly)
if (import.meta.url === `file://${process.argv[1]}`) {
  const library = new ClarkesLibrary();

  library
    .initialize()
    .then(() => {
      logger.info('System ready');
      logger.info('Status:', library.getStatus());

      // Example: Add a test article
      return library.addArticle({
        title: 'Getting Started with Clarke\'s Library',
        content: 'Clarke\'s Library is a multi-agent knowledge management system...',
        category: 'documentation',
        tags: ['getting-started', 'overview'],
        metadata: {
          author: 'system',
          confidence: 1.0,
          version: 1,
        },
      });
    })
    .then((article) => {
      logger.info('Created article:', article.id);
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Failed to initialize:', error);
      process.exit(1);
    });
}
