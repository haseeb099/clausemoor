import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    fetchBillingStatus,
    openBillingPortal,
    startCheckout,
} from "@/app/lib/billingApi";

const authenticatedFetch = vi.hoisted(() => vi.fn());

vi.mock("@/app/lib/authEvents", () => ({
    authenticatedFetch,
}));

function jsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

describe("billingApi", () => {
    beforeEach(() => {
        authenticatedFetch.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("starts checkout and returns the Stripe URL", async () => {
        authenticatedFetch.mockResolvedValue(
            jsonResponse({ url: "https://checkout.stripe.com/c/pay_123" }),
        );
        await expect(
            startCheckout({ planId: "chambers", interval: "year" }),
        ).resolves.toEqual({ url: "https://checkout.stripe.com/c/pay_123" });
        expect(authenticatedFetch).toHaveBeenCalledWith("/api/billing/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planId: "chambers", interval: "year" }),
        });
    });

    it("surfaces checkout failures with status and code", async () => {
        authenticatedFetch.mockResolvedValue(
            jsonResponse(
                { detail: "Card checkout is not enabled.", code: "billing_not_configured" },
                503,
            ),
        );
        await expect(
            startCheckout({ planId: "firm", interval: "month" }),
        ).rejects.toMatchObject({
            message: "Card checkout is not enabled.",
            status: 503,
            code: "billing_not_configured",
        });
    });

    it("uses a checkout fallback when the response has no detail or url", async () => {
        authenticatedFetch.mockResolvedValue(
            new Response("not-json", { status: 502, headers: { "Content-Type": "text/plain" } }),
        );
        await expect(
            startCheckout({ planId: "firm", interval: "month" }),
        ).rejects.toMatchObject({
            message: "Could not start checkout",
            status: 502,
            code: null,
        });
    });

    it("opens the billing portal", async () => {
        authenticatedFetch.mockResolvedValue(
            jsonResponse({ url: "https://billing.stripe.com/session" }),
        );
        await expect(openBillingPortal()).resolves.toEqual({
            url: "https://billing.stripe.com/session",
        });
    });

    it("surfaces portal failures", async () => {
        authenticatedFetch.mockResolvedValue(
            jsonResponse({ detail: "No card subscription yet.", code: "no_billing_customer" }, 400),
        );
        await expect(openBillingPortal()).rejects.toMatchObject({
            message: "No card subscription yet.",
            status: 400,
            code: "no_billing_customer",
        });
    });

    it("uses a portal fallback when the response has no detail or url", async () => {
        authenticatedFetch.mockResolvedValue(jsonResponse({}, 200));
        await expect(openBillingPortal()).rejects.toMatchObject({
            message: "Could not open billing portal",
            status: 200,
            code: null,
        });
    });

    it("loads billing status", async () => {
        authenticatedFetch.mockResolvedValue(
            jsonResponse({
                configured: true,
                subscription: {
                    planId: "chambers",
                    status: "active",
                    interval: "month",
                    tier: "Chambers",
                    hasCustomer: true,
                },
            }),
        );
        await expect(fetchBillingStatus()).resolves.toMatchObject({
            configured: true,
            subscription: { tier: "Chambers", hasCustomer: true },
        });
    });

    it("rejects a failed status load", async () => {
        authenticatedFetch.mockResolvedValue(jsonResponse({}, 500));
        await expect(fetchBillingStatus()).rejects.toThrow(
            "Could not load billing status",
        );
    });
});
