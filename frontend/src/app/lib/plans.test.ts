import { describe, expect, it } from "vitest";
import {
    formatGbp,
    planById,
    plansCatalog,
    salesMailto,
} from "@/app/lib/plans";

describe("plans catalog", () => {
    it("publishes the four commercial plans with GBP list prices", () => {
        expect(plansCatalog.currency).toBe("GBP");
        expect(plansCatalog.billingModel).toBe("invoice");
        expect(plansCatalog.plans.map((plan) => plan.id)).toEqual([
            "pilot",
            "chambers",
            "firm",
            "self-hosted",
        ]);
        expect(planById("chambers")?.priceMonthly).toBe(499);
        expect(planById("firm")?.priceAnnual).toBe(14900);
        expect(planById("self-hosted")?.priceAnnual).toBe(24000);
        expect(formatGbp(499)).toMatch(/£499/);
    });

    it("builds a sales mailto for an order enquiry", () => {
        const href = salesMailto({
            planId: "chambers",
            firmName: "Example LLP",
            contactName: "Alex Counsel",
            contactEmail: "alex@example.com",
            seats: "8",
            notes: "UK hosted",
        });
        expect(href.startsWith("mailto:sales@clausemoor.com?")).toBe(true);
        expect(decodeURIComponent(href)).toContain("Clausemoor Chambers enquiry");
        expect(decodeURIComponent(href)).toContain("Example LLP");
        expect(decodeURIComponent(href)).toContain("UK hosted");
    });
});
