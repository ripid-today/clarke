/**
 * Configuration management for Clarke's Library
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

export interface Config {
  anthropic: {
    apiKey: string;
  };
  pinecone: {
    apiKey: string;
    index: string;
    environment: string;
  };
  library: {
    path: string;
  };
  config: {
    path: string;
  };
  logging: {
    level: string;
  };
}

export const appConfig: Config = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || '',
    index: process.env.PINECONE_INDEX || 'clarke-library',
    environment: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
  },
  library: {
    path: process.env.LIBRARY_PATH || './library',
  },
  config: {
    path: process.env.CONFIG_PATH || './config',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export function validateConfig(): void {
  const required = [
    appConfig.anthropic.apiKey,
    appConfig.pinecone.apiKey,
  ];

  const missing = required.filter((v) => !v);
  if (missing.length > 0) {
    console.warn(
      'Warning: Missing required environment variables. ' +
        'Some features may not work correctly.'
    );
  }
}
