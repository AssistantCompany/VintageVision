// Logger Utility
// VintageVision - Structured Logging with Debug Toggle
// January 2026

// Read directly from process.env to avoid circular dependency with env.ts
const LOG_LEVEL = (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error';
const DEBUG = process.env.DEBUG === 'true' || process.env.DEBUG === '1';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[LOG_LEVEL] ?? LOG_LEVELS.info;

interface LogContext {
  [key: string]: unknown;
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = formatTimestamp();
  const prefix = level.toUpperCase().padEnd(5);

  if (context && Object.keys(context).length > 0) {
    // Structured JSON format for easy parsing by AI/tools
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...context,
    });
  }

  return `[${timestamp}] ${prefix} ${message}`;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= currentLevel;
}

export type { LogContext };

/**
 * Create a namespaced logger
 */
export function createLogger(namespace: string) {
  return {
    debug(message: string, context?: LogContext): void {
      if (DEBUG || shouldLog('debug')) {
        console.debug(formatMessage('debug', `[${namespace}] ${message}`, context));
      }
    },
    info(message: string, context?: LogContext): void {
      if (shouldLog('info')) {
        console.log(formatMessage('info', `[${namespace}] ${message}`, context));
      }
    },
    warn(message: string, context?: LogContext): void {
      if (shouldLog('warn')) {
        console.warn(formatMessage('warn', `[${namespace}] ${message}`, context));
      }
    },
    error(message: string, context?: LogContext): void {
      if (shouldLog('error')) {
        console.error(formatMessage('error', `[${namespace}] ${message}`, context));
      }
    }
  };
}

export const logger = {
  debug(message: string, context?: LogContext): void {
    if (DEBUG || shouldLog('debug')) {
      console.debug(formatMessage('debug', message, context));
    }
  },

  info(message: string, context?: LogContext): void {
    if (shouldLog('info')) {
      console.log(formatMessage('info', message, context));
    }
  },

  warn(message: string, context?: LogContext): void {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, context));
    }
  },

  error(message: string, context?: LogContext): void {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message, context));
    }
  },

  // Special method for verbose debug output (only when DEBUG=true)
  verbose(message: string, context?: LogContext): void {
    if (DEBUG) {
      console.debug(formatMessage('debug', `[VERBOSE] ${message}`, context));
    }
  },

  // Request logging helper
  request(method: string, path: string, statusCode: number, durationMs: number, context?: LogContext): void {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    this[level](`${method} ${path} ${statusCode} ${durationMs}ms`, context);
  },

  // Analysis logging helper (for OpenAI calls)
  analysis(stage: string, message: string, context?: LogContext): void {
    if (DEBUG) {
      this.debug(`[ANALYSIS:${stage}] ${message}`, context);
    } else {
      this.info(`[ANALYSIS:${stage}] ${message}`);
    }
  },

  // Auth logging helper
  auth(action: string, message: string, context?: LogContext): void {
    this.info(`[AUTH:${action}] ${message}`, context);
  },

  // Database logging helper
  db(action: string, message: string, context?: LogContext): void {
    if (DEBUG) {
      this.debug(`[DB:${action}] ${message}`, context);
    }
  },

  // Startup info
  isDebug: DEBUG,
  level: LOG_LEVEL,
};

export default logger;
