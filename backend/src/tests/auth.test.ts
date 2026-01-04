import { describe, it, expect } from 'vitest';
import { app } from '../index.js';

describe('Auth Routes', () => {
    it('GET /api/auth/google should redirect to Google', async () => {
        const res = await app.request('/api/auth/google');
        expect(res.status).toBe(302);
        expect(res.headers.get('Location')).toContain('accounts.google.com');
    });

    it('GET /api/auth/me should return 401 when not logged in', async () => {
        const res = await app.request('/api/auth/me');
        expect(res.status).toBe(401);
    });
});
