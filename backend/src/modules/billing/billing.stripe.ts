import Stripe from "stripe";
import { productName } from "../../lib/brand";
import {
  PAID_PLANS,
  amountFor,
  type CheckoutInterval,
  type PaidPlanId,
} from "./billing.plans";

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: "2025-10-29.clover",
  });
}

export function webhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
}

export function appBaseUrl(): string {
  const raw =
    process.env.FRONTEND_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export async function createCheckoutSession(input: {
  userId: string;
  email: string;
  planId: PaidPlanId;
  interval: CheckoutInterval;
  customerId?: string | null;
}): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  if (!stripe) {
    throw Object.assign(new Error("Stripe is not configured"), {
      code: "billing_not_configured",
      status: 503,
    });
  }
  const plan = PAID_PLANS[input.planId];
  const brand = productName();
  const base = appBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: input.customerId || undefined,
    customer_email: input.customerId ? undefined : input.email || undefined,
    client_reference_id: input.userId,
    success_url: `${base}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?checkout=cancelled`,
    allow_promotion_codes: true,
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    ...(input.customerId
      ? {
          customer_update: {
            name: "auto" as const,
            address: "auto" as const,
          },
        }
      : {}),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: amountFor(plan, input.interval),
          recurring: { interval: input.interval },
          product_data: {
            name: `${brand} ${plan.name}`,
            description:
              input.interval === "year"
                ? "Annual hosted subscription"
                : "Monthly hosted subscription",
            metadata: { plan_id: plan.id },
          },
        },
      },
    ],
    metadata: {
      user_id: input.userId,
      plan_id: plan.id,
      interval: input.interval,
    },
    subscription_data: {
      metadata: {
        user_id: input.userId,
        plan_id: plan.id,
        interval: input.interval,
      },
    },
  });
  if (!session.url) {
    throw Object.assign(new Error("Stripe did not return a checkout URL"), {
      code: "billing_checkout_failed",
      status: 502,
    });
  }
  return { url: session.url, sessionId: session.id };
}

export async function createBillingPortalSession(input: {
  customerId: string;
}): Promise<{ url: string }> {
  const stripe = getStripe();
  if (!stripe) {
    throw Object.assign(new Error("Stripe is not configured"), {
      code: "billing_not_configured",
      status: 503,
    });
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: input.customerId,
    return_url: `${appBaseUrl()}/settings#usage-plan`,
  });
  return { url: session.url };
}
