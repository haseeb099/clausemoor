import { describe, expect, it, vi } from "vitest";
import {
  applyCheckoutCompleted,
  applySubscriptionState,
} from "../billing.service";

function mockDb() {
  const updates: Array<{ patch: Record<string, unknown>; userId: string }> = [];
  const chain: Record<string, unknown> = {};
  for (const method of ["from", "select", "eq"]) {
    chain[method] = vi.fn(() => chain);
  }
  chain.maybeSingle = vi.fn(async () => ({ data: null, error: null }));
  chain.update = vi.fn((patch: Record<string, unknown>) => {
    return {
      eq: vi.fn(async (_column: string, userId: string) => {
        updates.push({ patch, userId });
        return { error: null };
      }),
    };
  });
  return { db: chain as never, updates };
}

describe("billing service", () => {
  it("marks the user Chambers after checkout completes", async () => {
    const { db, updates } = mockDb();
    await applyCheckoutCompleted(db, {
      client_reference_id: "user-1",
      metadata: { plan_id: "chambers", interval: "month", user_id: "user-1" },
      customer: "cus_123",
      subscription: "sub_123",
    } as never);
    expect(updates).toHaveLength(1);
    expect(updates[0].userId).toBe("user-1");
    expect(updates[0].patch.tier).toBe("Chambers");
    expect(updates[0].patch.subscription_status).toBe("active");
    expect(updates[0].patch.stripe_customer_id).toBe("cus_123");
  });

  it("returns the account to Pilot when the subscription ends", async () => {
    const { db, updates } = mockDb();
    await applySubscriptionState(db, {
      userId: "user-1",
      planId: "firm",
      status: "canceled",
      subscriptionId: "sub_old",
    });
    expect(updates[0].patch.tier).toBe("Pilot");
    expect(updates[0].patch.subscription_status).toBe("canceled");
  });
});
