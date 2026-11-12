/** Hosted plans sold through Stripe Checkout. Self-hosted stays invoice-only. */

export type CheckoutInterval = "month" | "year";

export type PaidPlanId = "chambers" | "firm";

export type PaidPlan = {
  id: PaidPlanId;
  name: string;
  tierLabel: string;
  monthlyPence: number;
  annualPence: number;
};

export const PAID_PLANS: Record<PaidPlanId, PaidPlan> = {
  chambers: {
    id: "chambers",
    name: "Chambers",
    tierLabel: "Chambers",
    monthlyPence: 499_00,
    annualPence: 4_990_00,
  },
  firm: {
    id: "firm",
    name: "Firm",
    tierLabel: "Firm",
    monthlyPence: 1_490_00,
    annualPence: 14_900_00,
  },
};

export function isPaidPlanId(value: unknown): value is PaidPlanId {
  return value === "chambers" || value === "firm";
}

export function isCheckoutInterval(value: unknown): value is CheckoutInterval {
  return value === "month" || value === "year";
}

export function amountFor(
  plan: PaidPlan,
  interval: CheckoutInterval,
): number {
  return interval === "year" ? plan.annualPence : plan.monthlyPence;
}
