import type Stripe from "stripe";
import type { Db } from "../../lib/supabase";
import { PAID_PLANS, type PaidPlanId } from "./billing.plans";

export type BillingProfile = {
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_plan_id: string | null;
  subscription_status: string | null;
  subscription_interval: string | null;
  tier: string | null;
};

export async function readBillingProfile(
  db: Db,
  userId: string,
): Promise<BillingProfile | null> {
  const { data, error } = await db
    .from("user_profiles")
    .select(
      "stripe_customer_id, stripe_subscription_id, subscription_plan_id, subscription_status, subscription_interval, tier",
    )
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as BillingProfile | null) ?? null;
}

function tierForPlan(planId: string | null | undefined): string {
  if (planId && planId in PAID_PLANS) {
    return PAID_PLANS[planId as PaidPlanId].tierLabel;
  }
  return "Pilot";
}

export async function applySubscriptionState(
  db: Db,
  input: {
    userId: string;
    customerId?: string | null;
    subscriptionId?: string | null;
    planId?: string | null;
    status?: string | null;
    interval?: string | null;
  },
): Promise<void> {
  const active =
    input.status === "active" ||
    input.status === "trialing" ||
    input.status === "past_due";
  const patch: Record<string, unknown> = {
    subscription_updated_at: new Date().toISOString(),
  };
  if (input.customerId !== undefined) {
    patch.stripe_customer_id = input.customerId;
  }
  if (input.subscriptionId !== undefined) {
    patch.stripe_subscription_id = input.subscriptionId;
  }
  if (input.planId !== undefined) {
    patch.subscription_plan_id = input.planId;
  }
  if (input.status !== undefined) {
    patch.subscription_status = input.status;
  }
  if (input.interval !== undefined) {
    patch.subscription_interval = input.interval;
  }
  if (input.status !== undefined) {
    patch.tier = active ? tierForPlan(input.planId) : "Pilot";
  }

  const { error } = await db
    .from("user_profiles")
    .update(patch)
    .eq("user_id", input.userId);
  if (error) throw error;
}

export async function applyCheckoutCompleted(
  db: Db,
  session: Stripe.Checkout.Session,
): Promise<void> {
  const userId =
    session.client_reference_id ||
    session.metadata?.user_id ||
    null;
  if (!userId) return;
  const planId = session.metadata?.plan_id ?? null;
  const interval = session.metadata?.interval ?? null;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  await applySubscriptionState(db, {
    userId,
    customerId,
    subscriptionId,
    planId,
    interval,
    status: "active",
  });
}

export async function applySubscriptionEvent(
  db: Db,
  subscription: Stripe.Subscription,
): Promise<void> {
  const userId = subscription.metadata?.user_id;
  if (!userId) return;
  const planId = subscription.metadata?.plan_id ?? null;
  const interval =
    subscription.metadata?.interval ||
    subscription.items.data[0]?.price.recurring?.interval ||
    null;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  await applySubscriptionState(db, {
    userId,
    customerId,
    subscriptionId: subscription.id,
    planId,
    interval,
    status: subscription.status,
  });
}
