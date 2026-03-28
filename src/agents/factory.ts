/**
 * Agent Factory - Creates agent instances
 */

import type { AgentConfig, AgentTask } from '../types.js';
import { logger } from '../utils/logger.js';

interface Agent {
  config: AgentConfig;
  execute(task: AgentTask): Promise<string>;
}

class BaseAgent implements Agent {
  config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async execute(task: AgentTask): Promise<string> {
    logger.info(
      `[${this.config.name}] Executing: ${task.input.substring(0, 50)}...`
    );
    // Base implementation - agents would override this
    return `Processed by ${this.config.name}: ${task.input}`;
  }
}

export function createAgent(config: AgentConfig): Agent {
  logger.info(`Creating agent: ${config.name}`);
  return new BaseAgent(config);
}

// Predefined agent configurations
export const agentConfigs: Record<string, AgentConfig> = {
  researcher: {
    name: 'researcher',
    model: 'claude-sonnet-4-6',
    systemPrompt:
      'You are a research agent that synthesizes information from documents.',
    skills: ['research-news', 'deep-research'],
    confidenceThreshold: 0.9,
  },
  'knowledge-organizer': {
    name: 'knowledge-organizer',
    model: 'claude-sonnet-4-6',
    systemPrompt:
      'You are a knowledge organization agent that maintains library taxonomy.',
    skills: ['organizer-toolkit', 'update-library'],
    confidenceThreshold: 0.9,
  },
  'business-analyst': {
    name: 'business-analyst',
    model: 'claude-sonnet-4-6',
    systemPrompt:
      'You are a business analyst that writes PRDs with clear requirements.',
    skills: ['ba-toolkit', 'write-prd'],
    confidenceThreshold: 0.95,
  },
  'web-developer': {
    name: 'web-developer',
    model: 'claude-sonnet-4-6',
    systemPrompt:
      'You are a web developer that implements features with minimal changes.',
    skills: ['dev-toolkit', 'frontend-design'],
    confidenceThreshold: 0.9,
  },
  'qa-tester': {
    name: 'qa-tester',
    model: 'claude-sonnet-4-6',
    systemPrompt:
      'You are a QA tester that validates implementations against requirements.',
    skills: ['qa-toolkit', 'webapp-testing'],
    confidenceThreshold: 0.9,
  },
};
