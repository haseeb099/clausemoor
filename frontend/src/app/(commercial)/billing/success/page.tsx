import type { Metadata } from "next";
import Link from "next/link";
import { productName } from "@clausemoor/client";

export const metadata: Metadata = {
    title: `Payment received · ${productName()}`,
};

export default function BillingSuccessPage() {
    const brand = productName();
    return (
        <div className="mx-auto max-w-xl space-y-5 commercial-rise">
            <p className="font-serif text-4xl text-[var(--commercial-ink)]">
                {brand}
            </p>
            <div className="h-1 w-24 rounded-full bg-[var(--commercial-gold)] commercial-mark-line" />
            <h1 className="text-2xl font-medium">Payment received</h1>
            <p className="text-base leading-7 text-[color:rgb(27_58_75_/_0.78)]">
                Stripe has confirmed your subscription. Your workspace plan
                updates when the webhook lands — usually within a few seconds.
                Open the app to continue onboarding.
            </p>
            <div className="flex flex-wrap gap-3">
                <Link
                    href="/assistant"
                    className="rounded-md bg-[var(--commercial-ink)] px-4 py-2.5 text-sm font-medium text-[var(--commercial-paper)]"
                >
                    Open workspace
                </Link>
                <Link
                    href="/settings#usage-plan"
                    className="rounded-md border border-[var(--commercial-ink)] px-4 py-2.5 text-sm font-medium text-[var(--commercial-ink)]"
                >
                    View plan
                </Link>
            </div>
        </div>
    );
}
