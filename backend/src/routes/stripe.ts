/**
 * Stripe Routes - Subscription management
 * VintageVision - January 2026
 *
 * Endpoints:
 * - POST /api/create-checkout-session - Create Stripe checkout session
 * - POST /api/webhooks/stripe - Handle Stripe webhook events
 * - GET /api/subscription/status - Get current subscription status
 * - POST /api/subscription/cancel - Cancel subscription
 */

import { Hono } from 'hono';
import Stripe from 'stripe';
import { requireAuth, getCurrentUser } from '../middleware/auth.js';
import { ValidationError } from '../middleware/error.js';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

// Initialize Stripe client (only if key is configured)
const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

// Price mapping based on plan and billing cycle
const PRICE_MAP: Record<string, Record<string, string | undefined>> = {
  collector: {
    monthly: env.STRIPE_PRICE_COLLECTOR_MONTHLY,
    annual: env.STRIPE_PRICE_COLLECTOR_ANNUAL,
  },
  professional: {
    monthly: env.STRIPE_PRICE_PROFESSIONAL_MONTHLY,
    annual: env.STRIPE_PRICE_PROFESSIONAL_ANNUAL,
  },
};

// Subscription tier limits (for reference)
export const SUBSCRIPTION_LIMITS = {
  free: {
    analysesPerMonth: 3,
    collectionItems: 3,
    apiAccess: false,
  },
  collector: {
    analysesPerMonth: Infinity,
    collectionItems: 50,
    apiAccess: false,
  },
  professional: {
    analysesPerMonth: Infinity,
    collectionItems: Infinity,
    apiAccess: true,
  },
};

const stripeRoutes = new Hono();

/**
 * Helper to get current_period_end from subscription items
 * In Stripe SDK v20, current_period_end is on subscription items, not the subscription itself
 */
function getSubscriptionPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const firstItem = subscription.items?.data?.[0];
  if (firstItem && typeof firstItem.current_period_end === 'number') {
    return new Date(firstItem.current_period_end * 1000);
  }
  return null;
}

/**
 * Safely extract string ID from a value that may be a string or an object with id property.
 * Used for Stripe API responses where customer/subscription can be string or expanded object.
 * Handles Stripe types including DeletedCustomer which also has an id.
 */
function extractStringId(value: string | { id: string } | null | undefined): string | null {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'id' in value) return value.id;
  return null;
}

/**
 * Find user by subscription metadata or customer ID.
 * Tries metadata.userId first, then falls back to stripeCustomerId lookup.
 */
async function findUserBySubscriptionOrCustomer(
  subscriptionOrCustomer: {
    metadata?: { userId?: string };
    customer?: string | Stripe.Customer | Stripe.DeletedCustomer;
  }
): Promise<typeof users.$inferSelect | null> {
  // Try metadata first
  const userId = subscriptionOrCustomer.metadata?.userId;
  if (userId) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (user) return user;
  }

  // Fallback to customer ID
  const customerId = extractStringId(subscriptionOrCustomer.customer);

  if (customerId) {
    const [user] = await db.select().from(users)
      .where(eq(users.stripeCustomerId, customerId))
      .limit(1);
    return user || null;
  }

  return null;
}

// ============================================================================
// CREATE CHECKOUT SESSION
// ============================================================================

const CreateCheckoutSessionSchema = z.object({
  planId: z.enum(['collector', 'professional']),
  billingCycle: z.enum(['monthly', 'annual']),
});

stripeRoutes.post('/create-checkout-session', requireAuth, async (c) => {
  try {
    if (!stripe) {
      logger.error('Stripe not configured - STRIPE_SECRET_KEY missing');
      return c.json(
        { success: false, error: 'Payment system not configured' },
        503
      );
    }

    const user = getCurrentUser(c)!;
    const body = await c.req.json();
    const { planId, billingCycle } = CreateCheckoutSessionSchema.parse(body);

    // Get the price ID from environment
    const priceId = PRICE_MAP[planId]?.[billingCycle];
    if (!priceId) {
      logger.error(`Price not configured for ${planId}/${billingCycle}`);
      return c.json(
        { success: false, error: 'Selected plan is not available' },
        400
      );
    }

    logger.info(`Creating checkout session for user ${user.email} - ${planId}/${billingCycle}`);

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      }, {
        idempotencyKey: `customer-${user.id}`,
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await db
        .update(users)
        .set({ stripeCustomerId: customerId, updatedAt: new Date() })
        .where(eq(users.id, user.id));

      logger.info(`Created Stripe customer ${customerId} for user ${user.email}`);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${env.FRONTEND_URL}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        planId,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId,
        },
      },
    });

    logger.info(`Checkout session created: ${session.id} for user ${user.email}`);

    return c.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0]?.message || 'Invalid request data');
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error creating checkout session: ${errorMessage}`);
    throw error;
  }
});

// ============================================================================
// STRIPE WEBHOOKS
// ============================================================================

stripeRoutes.post('/webhooks/stripe', async (c) => {
  try {
    if (!stripe) {
      logger.error('Stripe not configured for webhooks');
      return c.json({ success: false, error: 'Stripe not configured' }, 503);
    }

    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error('STRIPE_WEBHOOK_SECRET not configured');
      return c.json({ success: false, error: 'Webhook secret not configured' }, 503);
    }

    // Get the raw body for signature verification
    const rawBody = await c.req.text();
    const signature = c.req.header('stripe-signature');

    if (!signature) {
      logger.error('Missing stripe-signature header');
      return c.json({ success: false, error: 'Missing signature' }, 400);
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      // Distinguish client errors (bad signature/timestamp) from server errors
      if (err instanceof Error &&
          (err.message.includes('signature') || err.message.includes('timestamp'))) {
        logger.error(`Webhook signature verification failed: ${err.message}`);
        return c.json({ success: false, error: 'Invalid signature' }, 400);
      }
      // Otherwise it's a server error - let it propagate (500)
      throw err;
    }

    logger.info(`Stripe webhook received: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        logger.info(`Unhandled webhook event type: ${event.type}`);
    }

    return c.json({ success: true, received: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error processing webhook: ${errorMessage}`);
    return c.json({ success: false, error: 'Webhook processing failed' }, 500);
  }
});

// ============================================================================
// WEBHOOK HANDLERS
// ============================================================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    logger.error('Missing metadata in checkout session', { sessionId: session.id });
    throw new Error(`Missing required metadata in checkout session ${session.id}`);
  }

  logger.info(`Checkout completed for user ${userId}, plan: ${planId}`);

  // Get subscription details
  const subscriptionId = extractStringId(session.subscription);

  if (!stripe) {
    throw new Error('Stripe client not initialized');
  }

  if (!subscriptionId) {
    throw new Error(`Missing subscription ID in checkout session ${session.id}`);
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const currentPeriodEnd = getSubscriptionPeriodEnd(subscription);

  // Update user subscription
  await db
    .update(users)
    .set({
      subscriptionTier: planId,
      stripeSubscriptionId: subscriptionId,
      subscriptionEndsAt: currentPeriodEnd,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  logger.info(`User ${userId} upgraded to ${planId}, subscription ends: ${currentPeriodEnd?.toISOString() || 'unknown'}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Use helper function to find user by metadata or customer ID
  const user = await findUserBySubscriptionOrCustomer(subscription);

  if (!user) {
    const customerId = extractStringId(subscription.customer);
    logger.error('Could not find user for subscription update', {
      subscriptionId: subscription.id,
      customerId,
    });
    throw new Error(`Could not find user for subscription update: ${subscription.id}`);
  }

  const currentPeriodEnd = getSubscriptionPeriodEnd(subscription);
  const planId = subscription.metadata?.planId || user.subscriptionTier;

  // Handle subscription status
  let subscriptionTier = planId;
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    subscriptionTier = 'free';
  }

  await db
    .update(users)
    .set({
      subscriptionTier: subscriptionTier || 'free',
      subscriptionEndsAt: currentPeriodEnd,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  logger.info(`Subscription updated for user ${user.email}: ${subscriptionTier}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Try to find user by subscription ID first
  let user: typeof users.$inferSelect | null = null;

  const [userBySubscription] = await db
    .select()
    .from(users)
    .where(eq(users.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (userBySubscription) {
    user = userBySubscription;
  } else {
    // Fallback to helper function (metadata or customer ID)
    user = await findUserBySubscriptionOrCustomer(subscription);
  }

  if (!user) {
    const customerId = extractStringId(subscription.customer);
    logger.error('Could not find user for subscription deletion', {
      subscriptionId: subscription.id,
      customerId,
    });
    throw new Error(`Could not find user for subscription deletion: ${subscription.id}`);
  }

  // Downgrade to free
  await db
    .update(users)
    .set({
      subscriptionTier: 'free',
      stripeSubscriptionId: null,
      subscriptionEndsAt: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  logger.info(`Subscription deleted for user ${user.email}, downgraded to free`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = extractStringId(invoice.customer);

  if (!customerId) {
    logger.warn(`Payment failed with no customer ID, invoice: ${invoice.id}`);
    return; // Not throwing here since payment failure doesn't need retry
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (user) {
    logger.warn(`Payment failed for user ${user.email}, invoice: ${invoice.id}`);
    // Could send notification email here, or mark user as having payment issues
  } else {
    logger.warn(`Payment failed but user not found for customer ${customerId}, invoice: ${invoice.id}`);
    // Not throwing here since this is informational and doesn't need retry
  }
}

// ============================================================================
// SUBSCRIPTION STATUS
// ============================================================================

stripeRoutes.get('/subscription/status', requireAuth, async (c) => {
  const user = getCurrentUser(c)!;

  // Build status response
  const status = {
    tier: user.subscriptionTier,
    limits: SUBSCRIPTION_LIMITS[user.subscriptionTier as keyof typeof SUBSCRIPTION_LIMITS] ||
      SUBSCRIPTION_LIMITS.free,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    subscriptionEndsAt: user.subscriptionEndsAt,
    isActive: user.subscriptionTier !== 'free',
  };

  // If user has an active subscription, fetch more details from Stripe
  if (stripe && user.stripeSubscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const currentPeriodEnd = getSubscriptionPeriodEnd(subscription);

      return c.json({
        success: true,
        data: {
          ...status,
          stripeStatus: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error fetching subscription from Stripe: ${errorMessage}`);
      // Return basic status if Stripe fetch fails
    }
  }

  return c.json({
    success: true,
    data: status,
  });
});

// ============================================================================
// CANCEL SUBSCRIPTION
// ============================================================================

stripeRoutes.post('/subscription/cancel', requireAuth, async (c) => {
  try {
    if (!stripe) {
      return c.json(
        { success: false, error: 'Payment system not configured' },
        503
      );
    }

    const user = getCurrentUser(c)!;

    if (!user.stripeSubscriptionId) {
      throw new ValidationError('No active subscription to cancel');
    }

    logger.info(`Canceling subscription for user ${user.email}`);

    // Cancel at period end (user keeps access until subscription ends)
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    logger.info(`Subscription ${subscription.id} set to cancel at period end`);

    const cancelAt = getSubscriptionPeriodEnd(subscription);

    return c.json({
      success: true,
      data: {
        message: 'Subscription will be canceled at the end of the current billing period',
        cancelAt,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error canceling subscription: ${errorMessage}`);
    throw error;
  }
});

// ============================================================================
// REACTIVATE SUBSCRIPTION
// ============================================================================

stripeRoutes.post('/subscription/reactivate', requireAuth, async (c) => {
  try {
    if (!stripe) {
      return c.json(
        { success: false, error: 'Payment system not configured' },
        503
      );
    }

    const user = getCurrentUser(c)!;

    if (!user.stripeSubscriptionId) {
      throw new ValidationError('No subscription to reactivate');
    }

    logger.info(`Reactivating subscription for user ${user.email}`);

    // Remove cancel at period end
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    logger.info(`Subscription ${subscription.id} reactivated`);

    return c.json({
      success: true,
      data: {
        message: 'Subscription reactivated successfully',
        status: subscription.status,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error reactivating subscription: ${errorMessage}`);
    throw error;
  }
});

// ============================================================================
// CREATE CUSTOMER PORTAL SESSION (for managing payment methods, etc.)
// ============================================================================

stripeRoutes.post('/create-portal-session', requireAuth, async (c) => {
  try {
    if (!stripe) {
      return c.json(
        { success: false, error: 'Payment system not configured' },
        503
      );
    }

    const user = getCurrentUser(c)!;

    if (!user.stripeCustomerId) {
      throw new ValidationError('No customer account found');
    }

    logger.info(`Creating portal session for user ${user.email}`);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.FRONTEND_URL}/pricing`,
    });

    return c.json({
      success: true,
      data: {
        url: portalSession.url,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error creating portal session: ${errorMessage}`);
    throw error;
  }
});

export default stripeRoutes;
