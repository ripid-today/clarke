/**
 * Vector Store - Pinecone integration for semantic search
 */

import { Pinecone, type RecordMetadata } from '@pinecone-database/pinecone';
import { appConfig } from '../config.js';
import { logger } from '../utils/logger.js';
import type { VectorSearchResult } from '../types.js';

export class VectorStore {
  private client: Pinecone | null = null;
  private indexName: string;

  constructor() {
    this.indexName = appConfig.pinecone.index;
  }

  /**
   * Initialize Pinecone connection
   */
  async initialize(): Promise<void> {
    if (!appConfig.pinecone.apiKey) {
      logger.warn('Pinecone API key not configured');
      return;
    }

    try {
      this.client = new Pinecone({
        apiKey: appConfig.pinecone.apiKey,
      });
      logger.info('Connected to Pinecone');
    } catch (error) {
      logger.error('Failed to connect to Pinecone:', error);
      throw error;
    }
  }

  /**
   * Check if vector store is available
   */
  isAvailable(): boolean {
    return this.client !== null;
  }

  /**
   * Upsert vectors into the index
   */
  async upsert(
    vectors: Array<{
      id: string;
      values: number[];
      metadata: RecordMetadata;
    }>
  ): Promise<void> {
    if (!this.client) {
      throw new Error('Vector store not initialized');
    }

    const index = this.client.index(this.indexName);
    await index.upsert(vectors);
    logger.info(`Upserted ${vectors.length} vectors`);
  }

  /**
   * Query vectors by similarity
   */
  async query(
    vector: number[],
    topK: number = 5,
    filter?: Record<string, unknown>
  ): Promise<VectorSearchResult[]> {
    if (!this.client) {
      throw new Error('Vector store not initialized');
    }

    const index = this.client.index(this.indexName);
    const results = await index.query({
      vector,
      topK,
      filter,
      includeMetadata: true,
    });

    return (
      results.matches?.map((match) => ({
        id: match.id,
        score: match.score || 0,
        metadata: (match.metadata as Record<string, unknown>) || {},
      })) || []
    );
  }

  /**
   * Delete vectors by ID
   */
  async delete(ids: string[]): Promise<void> {
    if (!this.client) {
      throw new Error('Vector store not initialized');
    }

    const index = this.client.index(this.indexName);
    await index.deleteMany(ids);
    logger.info(`Deleted ${ids.length} vectors`);
  }
}
