/**
 * Agent Orchestrator - Routes tasks to appropriate agents
 */

import type { AgentTask, AgentConfig } from '../types.js';
import { logger } from '../utils/logger.js';

interface Agent {
  config: AgentConfig;
  execute(task: AgentTask): Promise<string>;
}

export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();

  /**
   * Register an agent
   */
  registerAgent(name: string, agent: Agent): void {
    this.agents.set(name, agent);
    logger.info(`Registered agent: ${name}`);
  }

  /**
   * Route a task to the appropriate agent
   */
  async routeTask(task: AgentTask): Promise<string> {
    const agent = this.agents.get(task.type);

    if (!agent) {
      throw new Error(`No agent found for task type: ${task.type}`);
    }

    logger.info(`Routing task ${task.id} to agent: ${task.type}`);

    try {
      const result = await agent.execute(task);
      logger.info(`Task ${task.id} completed successfully`);
      return result;
    } catch (error) {
      logger.error(`Task ${task.id} failed:`, error);
      throw error;
    }
  }

  /**
   * Get list of available agents
   */
  getAvailableAgents(): string[] {
    return Array.from(this.agents.keys());
  }

  /**
   * Assess confidence level for a task
   */
  assessConfidence(task: AgentTask): number {
    // Simple confidence assessment based on task clarity
    const hasInput = task.input && task.input.length > 0;
    const hasContext = task.context && Object.keys(task.context).length > 0;

    if (hasInput && hasContext) return 0.95;
    if (hasInput) return 0.85;
    return 0.7;
  }
}
