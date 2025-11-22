import type { Context } from 'hono';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
export declare class ValidationError extends AppError {
    constructor(message: string);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string);
}
export declare class AuthorizationError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class RateLimitError extends AppError {
    constructor(message?: string);
}
export declare class ExternalServiceError extends AppError {
    service: string;
    constructor(message: string, service: string);
}
export declare function errorHandler(err: Error, c: Context): Promise<Response & import("hono").TypedResponse<{
    stack?: string | undefined;
    success: false;
    error: string;
}, any, "json">>;
export declare function asyncHandler(fn: Function): (c: Context, next: any) => Promise<any>;
//# sourceMappingURL=error.d.ts.map