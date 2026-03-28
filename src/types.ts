/**
 * Core types for Clarke's Library
 */

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  metadata: ArticleMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleMetadata {
  author?: string;
  source?: string;
  confidence: number;
  version: number;
  relatedArticles?: string[];
}

export interface AgentTask {
  id: string;
  type: TaskType;
  input: string;
  context?: Record<string, unknown>;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
}

export type TaskType =
  | 'research'
  | 'organize'
  | 'analyze'
  | 'develop'
  | 'test';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface LibraryQuery {
  query: string;
  category?: string;
  tags?: string[];
  limit?: number;
  threshold?: number;
}

export interface AgentConfig {
  name: string;
  model: string;
  systemPrompt: string;
  skills: string[];
  confidenceThreshold: number;
}

export interface WorkflowStep {
  agent: string;
  task: string;
  input: string;
  output?: string;
}
