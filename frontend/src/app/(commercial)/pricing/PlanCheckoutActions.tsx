"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startCheckout, type CheckoutInterval } from "@/app/lib/billingApi";

export function PlanCheckoutActions({
    planId,
    highlighted,
    contactLabel,
}: {
    planId: "chambers" | "firm";
    highlighted: boolean;
    contactLabel: string;
}) {
    const router = useRouter();
    const [interval, setInterval] = useState<CheckoutInterval>("month");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const primaryClass = highlighted
        ? "bg-[var(--commercial-ink)] text-[var(--commercial-paper)]"
        : "border border-[var(--commercial-ink)] text-[var(--commercial-ink)]";

    return (
        <div className="space-y-3">
            <div className="flex gap-2 text-xs">
                <button
                    type="button"
                    onClick={() => setInterval("month")}
                    className={`rounded-md px-2.5 py-1 ${
                        interval === "month"
                            ? "bg-[var(--commercial-ink)] text-[var(--commercial-paper)]"
                            : "bg-white/70 text-[var(--commercial-ink)]"
                    }`}
                >
                    Monthly
                </button>
                <button
                    type="button"
                    onClick={() => setInterval("year")}
                    className={`rounded-md px-2.5 py-1 ${
                        interval === "year"
                            ? "bg-[var(--commercial-ink)] text-[var(--commercial-paper)]"
                            : "bg-white/70 text-[var(--commercial-ink)]"
                    }`}
                >
                    Annual
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                        void (async () => {
                            setBusy(true);
                            setError(null);
                            try {
                                const { url } = await startCheckout({
                                    planId,
                                    interval,
                                });
                                window.location.href = url;
                            } catch (err) {
                                const status = (err as { status?: number })
                                    .status;
                                if (status === 401) {
                                    router.push(
                                        `/signup?plan=${planId}&interval=${interval}&checkout=1`,
                                    );
                                    return;
                                }
                                if (status === 503) {
                                    router.push(`/contact?plan=${planId}`);
                                    return;
                                }
                                setError(
                                    err instanceof Error
                                        ? err.message
                                        : "Checkout failed",
                                );
                            } finally {
                                setBusy(false);
                            }
                        })();
                    }}
                    className={`inline-flex rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 ${primaryClass}`}
                >
                    {busy ? "Starting checkout…" : "Pay with card"}
                </button>
                <Link
                    href={`/contact?plan=${encodeURIComponent(planId)}`}
                    className="inline-flex rounded-md border border-[color:rgb(27_58_75_/_0.25)] px-4 py-2.5 text-sm font-medium text-[var(--commercial-ink)]"
                >
                    {contactLabel}
                </Link>
            </div>
            {error ? (
                <p className="text-xs text-red-700">{error}</p>
            ) : (
                <p className="text-xs text-[color:rgb(27_58_75_/_0.65)]">
                    Secure Stripe Checkout. Invoice sales remain available.
                </p>
            )}
        </div>
    );
}
