// Error Logging Route
// Logs frontend errors for debugging and monitoring
import { Hono } from 'hono';
import { db } from '../db/client.js';
import { errorLogs } from '../db/schema.js';
import { optionalAuth, getUserId } from '../middleware/auth.js';
const app = new Hono();
// Log error from frontend
app.post('/', optionalAuth, async (c) => {
    try {
        const body = await c.req.json();
        // Get user ID from session if available
        const userId = getUserId(c);
        // Insert error log
        await db.insert(errorLogs).values({
            userId: userId,
            errorType: body.errorType || body.type || 'unknown',
            errorMessage: body.message || body.errorMessage || 'No message provided',
            errorStack: body.stack || body.errorStack || null,
            requestData: {
                url: body.url,
                userAgent: body.userAgent,
                timestamp: body.timestamp,
                componentStack: body.componentStack,
                ...body
            }
        });
        console.log('📝 Error logged:', {
            type: body.errorType || body.type,
            message: body.message?.substring(0, 100),
            userId: userId ? 'authenticated' : 'anonymous'
        });
        return c.json({ success: true });
    }
    catch (error) {
        console.error('Error logging error (meta!):', error);
        // Don't fail the request if error logging fails
        return c.json({ success: false, error: 'Failed to log error' }, 200);
    }
});
export default app;
//# sourceMappingURL=errors.js.map