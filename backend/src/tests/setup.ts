// Mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.MINIO_ENDPOINT = 'http://localhost:9000';
process.env.MINIO_ACCESS_KEY = 'test-access-key';
process.env.MINIO_SECRET_KEY = 'test-secret-key';
process.env.MINIO_BUCKET_NAME = 'test-bucket';
process.env.OPENAI_API_KEY = 'sk-test-key';
process.env.SESSION_SECRET = 'test-session-secret-at-least-32-chars-long';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.API_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.TZ = 'UTC';
