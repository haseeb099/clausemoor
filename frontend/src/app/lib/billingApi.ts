import { authenticatedFetch } from "@/app/lib/authEvents";

export type CheckoutInterval = "month" | "year";

export async function startCheckout(input: {
    planId: "chambers" | "firm";
    interval: CheckoutInterval;
}): Promise<{ url: string }> {
    const response = await authenticatedFetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    const body = (await response.json().catch(() => ({}))) as {
        url?: string;
        detail?: string;
        code?: string;
    };
    if (!response.ok || !body.url) {
        throw Object.assign(
            new Error(body.detail || "Could not start checkout"),
            { status: response.status, code: body.code ?? null },
        );
    }
    return { url: body.url };
}

export async function openBillingPortal(): Promise<{ url: string }> {
    const response = await authenticatedFetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
    });
    const body = (await response.json().catch(() => ({}))) as {
        url?: string;
        detail?: string;
        code?: string;
    };
    if (!response.ok || !body.url) {
        throw Object.assign(
            new Error(body.detail || "Could not open billing portal"),
            { status: response.status, code: body.code ?? null },
        );
    }
    return { url: body.url };
}

export async function fetchBillingStatus(): Promise<{
    configured: boolean;
    subscription: {
        planId: string | null;
        status: string | null;
        interval: string | null;
        tier: string;
        hasCustomer: boolean;
    };
}> {
    const response = await authenticatedFetch("/api/billing/status");
    if (!response.ok) {
        throw new Error("Could not load billing status");
    }
    return response.json();
}
