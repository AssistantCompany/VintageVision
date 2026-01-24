// Environment Configuration
// VintageVision Self-Hosted
// Updated: January 2026 - Added logging configuration

import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

// Load .env from current directory, or parent directory if not found
const envPath = existsSync('.env') ? '.env' : join('..', '.env');
config({ path: envPath });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.string().default('3000'),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  DEBUG: z.string().transform(v => v === 'true' || v === '1').default('false'),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // MinIO (S3-Compatible Storage)
  MINIO_ENDPOINT: z.string(),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_BUCKET_NAME: z.string().default('vintagevision'),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),

  // Session
  SESSION_SECRET: z.string().min(32),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // App URLs
  FRONTEND_URL: z.string().url(),
  API_URL: z.string().default('http://localhost:3000'),

  // Stripe (Subscription payments)
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_COLLECTOR_MONTHLY: z.string().optional(),
  STRIPE_PRICE_COLLECTOR_ANNUAL: z.string().optional(),
  STRIPE_PRICE_PROFESSIONAL_MONTHLY: z.string().optional(),
  STRIPE_PRICE_PROFESSIONAL_ANNUAL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();

console.log('✅ Environment variables validated');
console.log(`📍 Running in ${env.NODE_ENV} mode`);
