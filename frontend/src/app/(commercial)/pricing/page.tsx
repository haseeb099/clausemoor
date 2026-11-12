import type { Metadata } from "next";
import Link from "next/link";
import { productName } from "@clausemoor/client";
import { formatGbp, plansCatalog } from "@/app/lib/plans";
import { PlanCheckoutActions } from "./PlanCheckoutActions";

export const metadata: Metadata = {
    title: `Pricing · ${productName()}`,
    description:
        "Hosted Chambers and Firm plans, plus self-hosted support contracts for UK and EU law firms.",
};

export default function PricingPage() {
    const brand = productName();
    return (
        <div className="space-y-12">
            <section className="max-w-3xl space-y-4 commercial-rise">
                <p className="font-serif text-4xl tracking-tight text-[var(--commercial-ink)] md:text-5xl">
                    {brand}
                </p>
                <div className="h-1 w-24 rounded-full bg-[var(--commercial-gold)] commercial-mark-line" />
                <h1 className="text-2xl font-medium tracking-tight text-[var(--commercial-ink)] md:text-3xl">
                    Plans for hosted firms and self-hosted installs
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[color:rgb(27_58_75_/_0.78)] commercial-rise-delay">
                    Start on a pilot account, then move to Chambers or Firm on
                    invoice. Self-hosted clients buy an annual support contract
                    and keep matter data on their own systems.
                </p>
            </section>

            <section className="grid gap-6 commercial-rise-late md:grid-cols-2">
                {plansCatalog.plans.map((plan) => (
                    <article
                        key={plan.id}
                        className={`flex flex-col gap-5 rounded-2xl border p-6 ${
                            plan.highlighted
                                ? "border-[var(--commercial-ink)] bg-white/80 shadow-[0_24px_60px_-36px_rgb(27_58_75_/_0.55)]"
                                : "border-[color:rgb(27_58_75_/_0.14)] bg-white/55"
                        }`}
                    >
                        <div className="space-y-2">
                            <div className="flex items-baseline justify-between gap-3">
                                <h2 className="font-serif text-3xl text-[var(--commercial-ink)]">
                                    {plan.name}
                                </h2>
                                {plan.highlighted ? (
                                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--commercial-gold)]">
                                        Popular
                                    </span>
                                ) : null}
                            </div>
                            <p className="text-sm leading-6 text-[color:rgb(27_58_75_/_0.72)]">
                                {plan.audience}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-2xl font-medium text-[var(--commercial-ink)]">
                                {plan.priceLabel}
                            </p>
                            {plan.priceAnnual != null && plan.priceMonthly != null ? (
                                <p className="text-sm text-[color:rgb(27_58_75_/_0.68)]">
                                    or {formatGbp(plan.priceAnnual)} / year
                                </p>
                            ) : null}
                            <p className="text-sm text-[color:rgb(27_58_75_/_0.68)]">
                                {plan.seats} · {plan.deployment}
                            </p>
                        </div>

                        <ul className="space-y-2 text-sm leading-6 text-[color:rgb(27_58_75_/_0.84)]">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex gap-2">
                                    <span
                                        aria-hidden
                                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--commercial-ink)]"
                                    />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto pt-2">
                            {plan.cta.kind === "signup" ? (
                                <Link
                                    href="/signup"
                                    className="inline-flex rounded-md bg-[var(--commercial-ink)] px-4 py-2.5 text-sm font-medium text-[var(--commercial-paper)] transition-opacity hover:opacity-90"
                                >
                                    {plan.cta.label}
                                </Link>
                            ) : plan.id === "chambers" || plan.id === "firm" ? (
                                <PlanCheckoutActions
                                    planId={plan.id}
                                    highlighted={plan.highlighted}
                                    contactLabel={plan.cta.label}
                                />
                            ) : (
                                <Link
                                    href={`/contact?plan=${encodeURIComponent(plan.id)}`}
                                    className={`inline-flex rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${
                                        plan.highlighted
                                            ? "bg-[var(--commercial-ink)] text-[var(--commercial-paper)]"
                                            : "border border-[var(--commercial-ink)] text-[var(--commercial-ink)]"
                                    }`}
                                >
                                    {plan.cta.label}
                                </Link>
                            )}
                        </div>
                    </article>
                ))}
            </section>

            <section className="max-w-3xl space-y-3 text-sm leading-6 text-[color:rgb(27_58_75_/_0.75)]">
                <p>{plansCatalog.vatNote}</p>
                <p>{plansCatalog.note}</p>
                <p>{plansCatalog.responseSla}</p>
                <p>
                    Need a paper order form first?{" "}
                    <Link href="/contact" className="underline">
                        Contact sales
                    </Link>
                    .
                </p>
            </section>
        </div>
    );
}
