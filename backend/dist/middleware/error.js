// Error Handling Middleware
// October 2025
import { db } from '../db/client.js';
import { errorLogs } from '../db/schema.js';
// Custom error classes
export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401);
    }
}
export class AuthorizationError extends AppError {
    constructor(message = 'Insufficient permissions') {
        super(message, 403);
    }
}
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429);
    }
}
export class ExternalServiceError extends AppError {
    service;
    constructor(message, service) {
        super(message, 502);
        this.service = service;
    }
}
// Log error to database
async function logError(error, userId, requestData) {
    try {
        await db.insert(errorLogs).values({
            userId: userId || null,
            errorType: error.name,
            errorMessage: error.message,
            errorStack: error.stack || null,
            requestData: requestData || null,
        });
    }
    catch (logError) {
        console.error('❌ Failed to log error to database:', logError);
    }
}
// Global error handler
export async function errorHandler(err, c) {
    console.error('❌ Error:', err);
    const req = c.req.raw;
    const userId = req.user?.id;
    // Log error to database (non-blocking)
    logError(err, userId, {
        method: c.req.method,
        path: c.req.path,
        query: c.req.query(),
        headers: Object.fromEntries(c.req.raw.headers.entries()),
    }).catch((e) => console.error('Error logging failed:', e));
    // Handle known errors
    if (err instanceof AppError) {
        return c.json({
            success: false,
            error: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        }, err.statusCode);
    }
    // Handle unknown errors
    const isDev = process.env.NODE_ENV === 'development';
    return c.json({
        success: false,
        error: isDev ? err.message : 'Internal server error',
        ...(isDev && { stack: err.stack }),
    }, 500);
}
// Async handler wrapper
export function asyncHandler(fn) {
    return async (c, next) => {
        try {
            return await fn(c, next);
        }
        catch (error) {
            return errorHandler(error, c);
        }
    };
}
console.log('✅ Error handling middleware loaded');
//# sourceMappingURL=error.js.map