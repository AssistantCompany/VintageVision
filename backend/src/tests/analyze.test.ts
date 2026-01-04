import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../index.js';

// Mock dependencies
vi.mock('../services/openai.js', () => ({
    analyzeAntiqueImage: vi.fn().mockResolvedValue({
        name: 'Test Antique',
        era: 'Victorian',
        style: 'Gothic',
        description: 'A beautiful test item',
        historicalContext: 'History',
        estimatedValueMin: 100,
        estimatedValueMax: 200,
        confidence: 0.95,
        stylingSuggestions: ['Shelf'],
    }),
    generateMarketplaceLinks: vi.fn().mockReturnValue([]),
}));

vi.mock('../storage/client.js', () => ({
    uploadImage: vi.fn().mockResolvedValue('test-image-key.jpg'),
    getImageUrl: vi.fn().mockReturnValue('http://minio/test.jpg'),
}));

// Mock DB
vi.mock('../db/client.js', () => {
    const mockDb = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
            id: 'test-id',
            name: 'Test Antique',
            era: 'Victorian',
            style: 'Gothic',
            description: 'A beautiful test item',
            historicalContext: 'History',
            estimatedValueMin: 100,
            estimatedValueMax: 200,
            confidence: 0.95,
            imageUrl: 'test-image-key.jpg',
            stylingSuggestions: ['Shelf'],
        }]),
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
    };
    return { db: mockDb };
});

describe('Analyze Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('POST /api/analyze should analyze image and return results', async () => {
        const mockImage = 'data:image/jpeg;base64,dGVzdA=='; // "test" in base64

        const res = await app.request('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: mockImage }),
        });

        expect(res.status).toBe(200);
        const data = await res.json() as any;
        expect(data.success).toBe(true);
        expect(data.data.name).toBe('Test Antique');
        expect(data.data.imageUrl).toBe('/api/images/test-image-key.jpg');
    });

    it('POST /api/analyze should reject invalid image format', async () => {
        const res = await app.request('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: 'invalid-data' }),
        });

        expect(res.status).toBe(400);
    });
});
