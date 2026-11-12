import { describe, expect, it } from "vitest";
import {
  amountFor,
  isCheckoutInterval,
  isPaidPlanId,
  PAID_PLANS,
} from "../billing.plans";

describe("billing plans", () => {
  it("prices Chambers and Firm in GBP pence", () => {
    expect(PAID_PLANS.chambers.monthlyPence).toBe(499_00);
    expect(PAID_PLANS.chambers.annualPence).toBe(4_990_00);
    expect(PAID_PLANS.firm.monthlyPence).toBe(1_490_00);
    expect(amountFor(PAID_PLANS.firm, "year")).toBe(14_900_00);
    expect(isPaidPlanId("chambers")).toBe(true);
    expect(isPaidPlanId("self-hosted")).toBe(false);
    expect(isCheckoutInterval("month")).toBe(true);
  });
});
