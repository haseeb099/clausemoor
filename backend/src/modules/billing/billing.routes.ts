import { Router, type Request, type Response } from "express";
import { requireAuth } from "../../middleware/auth";
import { asyncRoute, routerErrorHandler } from "../../middleware/asyncRoute";
import { createServerSupabase } from "../../lib/supabase";
import {
  isCheckoutInterval,
  isPaidPlanId,
  PAID_PLANS,
} from "./billing.plans";
import {
  createBillingPortalSession,
  createCheckoutSession,
  getStripe,
  stripeConfigured,
  webhookSecret,
} from "./billing.stripe";
import {
  applyCheckoutCompleted,
  applySubscriptionEvent,
  readBillingProfile,
} from "./billing.service";

export const billingRouter = Router();
export const billingWebhookRouter = Router();

billingRouter.get(
  "/status",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const userId = res.locals.userId as string;
    const profile = await readBillingProfile(createServerSupabase(), userId);
    res.json({
      configured: stripeConfigured(),
      currency: "GBP",
      plans: Object.values(PAID_PLANS).map((plan) => ({
        id: plan.id,
        name: plan.name,
        monthly: plan.monthlyPence / 100,
        annual: plan.annualPence / 100,
      })),
      subscription: profile
        ? {
            planId: profile.subscription_plan_id,
            status: profile.subscription_status,
            interval: profile.subscription_interval,
            tier: profile.tier || "Pilot",
            hasCustomer: Boolean(profile.stripe_customer_id),
          }
        : {
            planId: null,
            status: null,
            interval: null,
            tier: "Pilot",
            hasCustomer: false,
          },
    });
  }),
);

billingRouter.post(
  "/checkout",
  requireAuth,
  asyncRoute(async (req, res) => {
    if (!stripeConfigured()) {
      res.status(503).json({
        code: "billing_not_configured",
        detail:
          "Card checkout is not enabled. Set STRIPE_SECRET_KEY, or contact sales for an invoice.",
      });
      return;
    }
    const planId = req.body?.planId;
    const interval = req.body?.interval ?? "month";
    if (!isPaidPlanId(planId) || !isCheckoutInterval(interval)) {
      res.status(400).json({
        code: "invalid_request",
        detail: "Choose chambers or firm, and month or year.",
      });
      return;
    }
    const userId = res.locals.userId as string;
    const email = (res.locals.userEmail as string) || "";
    if (!email) {
      res.status(400).json({
        code: "email_unconfirmed",
        detail: "Confirm your email before starting checkout.",
      });
      return;
    }
    const profile = await readBillingProfile(createServerSupabase(), userId);
    try {
      const session = await createCheckoutSession({
        userId,
        email,
        planId,
        interval,
        customerId: profile?.stripe_customer_id,
      });
      res.json(session);
    } catch (error) {
      const status = (error as { status?: number }).status ?? 500;
      const code = (error as { code?: string }).code ?? "billing_checkout_failed";
      res.status(status).json({
        code,
        detail:
          error instanceof Error
            ? error.message
            : "Could not start checkout.",
      });
    }
  }),
);

billingRouter.post(
  "/portal",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const userId = res.locals.userId as string;
    const profile = await readBillingProfile(createServerSupabase(), userId);
    if (!profile?.stripe_customer_id) {
      res.status(400).json({
        code: "no_billing_customer",
        detail: "No card subscription is attached to this account yet.",
      });
      return;
    }
    try {
      const session = await createBillingPortalSession({
        customerId: profile.stripe_customer_id,
      });
      res.json(session);
    } catch (error) {
      const status = (error as { status?: number }).status ?? 500;
      res.status(status).json({
        code: "billing_portal_failed",
        detail:
          error instanceof Error
            ? error.message
            : "Could not open the billing portal.",
      });
    }
  }),
);

billingRouter.use(routerErrorHandler("billing"));

billingWebhookRouter.post(
  "/",
  asyncRoute(async (req: Request, res: Response) => {
    const stripe = getStripe();
    const secret = webhookSecret();
    if (!stripe || !secret) {
      res.status(503).json({
        code: "billing_not_configured",
        detail: "Stripe webhook is not configured.",
      });
      return;
    }
    const signature = req.headers["stripe-signature"];
    if (typeof signature !== "string") {
      res.status(400).json({
        code: "invalid_signature",
        detail: "Missing Stripe signature.",
      });
      return;
    }
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(typeof req.body === "string" ? req.body : "");
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (error) {
      res.status(400).json({
        code: "invalid_signature",
        detail:
          error instanceof Error
            ? error.message
            : "Invalid Stripe signature.",
      });
      return;
    }

    const db = createServerSupabase();
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await applyCheckoutCompleted(db, event.data.object);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await applySubscriptionEvent(db, event.data.object);
          break;
        default:
          break;
      }
      res.json({ received: true });
    } catch (error) {
      console.error("[billing/webhook] handler failed", error);
      res.status(500).json({
        code: "webhook_handler_failed",
        detail: "Failed to apply billing event.",
      });
    }
  }),
);

billingWebhookRouter.use(routerErrorHandler("billing.webhook"));
