"use client";

import { useEffect, useState } from "react";
import {
    fetchBillingStatus,
    openBillingPortal,
    startCheckout,
} from "@/app/lib/billingApi";

export function BillingPlanActions() {
    const [configured, setConfigured] = useState(false);
    const [hasCustomer, setHasCustomer] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;
        void fetchBillingStatus()
            .then((status) => {
                if (cancelled) return;
                setConfigured(status.configured);
                setHasCustomer(status.subscription.hasCustomer);
            })
            .catch(() => {
                if (!cancelled) setConfigured(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!configured) {
        return (
            <p className="text-xs leading-5 text-gray-500">
                Card billing is off until the operator sets{" "}
                <code className="text-[11px]">STRIPE_SECRET_KEY</code>. You can
                still request an invoice from Contact sales.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {hasCustomer ? (
                    <button
                        type="button"
                        disabled={busy}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => {
                            void (async () => {
                                setBusy(true);
                                setMessage(null);
                                try {
                                    const { url } = await openBillingPortal();
                                    window.location.href = url;
                                } catch (error) {
                                    setMessage(
                                        error instanceof Error
                                            ? error.message
                                            : "Could not open billing portal",
                                    );
                                } finally {
                                    setBusy(false);
                                }
                            })();
                        }}
                    >
                        Manage card billing
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={busy}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => {
                            void (async () => {
                                setBusy(true);
                                setMessage(null);
                                try {
                                    const { url } = await startCheckout({
                                        planId: "chambers",
                                        interval: "month",
                                    });
                                    window.location.href = url;
                                } catch (error) {
                                    setMessage(
                                        error instanceof Error
                                            ? error.message
                                            : "Could not start checkout",
                                    );
                                } finally {
                                    setBusy(false);
                                }
                            })();
                        }}
                    >
                        Upgrade with card
                    </button>
                )}
            </div>
            {message ? (
                <p className="text-xs text-red-600">{message}</p>
            ) : null}
        </div>
    );
}
