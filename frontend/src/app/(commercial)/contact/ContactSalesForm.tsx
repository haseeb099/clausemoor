"use client";

import { useMemo, useState } from "react";
import { plansCatalog, salesMailto } from "@/app/lib/plans";

export function ContactSalesForm({
    initialPlanId,
}: {
    initialPlanId?: string;
}) {
    const defaultPlan =
        plansCatalog.plans.find((plan) => plan.id === initialPlanId)?.id ??
        "chambers";
    const [planId, setPlanId] = useState(defaultPlan);
    const [firmName, setFirmName] = useState("");
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [seats, setSeats] = useState("");
    const [notes, setNotes] = useState("");

    const mailto = useMemo(
        () =>
            salesMailto({
                planId,
                firmName,
                contactName,
                contactEmail,
                seats,
                notes,
            }),
        [planId, firmName, contactName, contactEmail, seats, notes],
    );

    const canSend =
        firmName.trim().length > 1 &&
        contactName.trim().length > 1 &&
        /.+@.+\..+/.test(contactEmail.trim());

    return (
        <form
            className="space-y-4 rounded-2xl border border-[color:rgb(27_58_75_/_0.14)] bg-white/70 p-6 commercial-rise-late"
            onSubmit={(event) => {
                event.preventDefault();
                if (!canSend) return;
                window.location.href = mailto;
            }}
        >
            <div className="space-y-1">
                <label htmlFor="plan" className="text-sm font-medium">
                    Plan
                </label>
                <select
                    id="plan"
                    value={planId}
                    onChange={(event) => setPlanId(event.target.value)}
                    className="w-full rounded-md border border-[color:rgb(27_58_75_/_0.2)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--commercial-ink)]"
                >
                    {plansCatalog.plans
                        .filter((plan) => plan.cta.kind === "contact")
                        .map((plan) => (
                            <option key={plan.id} value={plan.id}>
                                {plan.name} — {plan.priceLabel}
                            </option>
                        ))}
                </select>
            </div>

            <div className="space-y-1">
                <label htmlFor="firm" className="text-sm font-medium">
                    Firm name
                </label>
                <input
                    id="firm"
                    value={firmName}
                    onChange={(event) => setFirmName(event.target.value)}
                    className="w-full rounded-md border border-[color:rgb(27_58_75_/_0.2)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--commercial-ink)]"
                    autoComplete="organization"
                    required
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label htmlFor="contact-name" className="text-sm font-medium">
                        Your name
                    </label>
                    <input
                        id="contact-name"
                        value={contactName}
                        onChange={(event) => setContactName(event.target.value)}
                        className="w-full rounded-md border border-[color:rgb(27_58_75_/_0.2)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--commercial-ink)]"
                        autoComplete="name"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="contact-email" className="text-sm font-medium">
                        Work email
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(event) => setContactEmail(event.target.value)}
                        className="w-full rounded-md border border-[color:rgb(27_58_75_/_0.2)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--commercial-ink)]"
                        autoComplete="email"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="seats" className="text-sm font-medium">
                    Approximate seats
                </label>
                <input
                    id="seats"
                    value={seats}
                    onChange={(event) => setSeats(event.target.value)}
                    placeholder="e.g. 8"
                    className="w-full rounded-md border border-[color:rgb(27_58_75_/_0.2)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--commercial-ink)]"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={4}
                    placeholder="Hosted region, self-hosted timeline, Word add-in needs…"
                    className="w-full rounded-md border border-[color:rgb(27_58_75_/_0.2)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--commercial-ink)]"
                />
            </div>

            <button
                type="submit"
                disabled={!canSend}
                className="inline-flex rounded-md bg-[var(--commercial-ink)] px-4 py-2.5 text-sm font-medium text-[var(--commercial-paper)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Email sales
            </button>
            <p className="text-xs leading-5 text-[color:rgb(27_58_75_/_0.65)]">
                Opens your email client with a ready message to sales. Prefer a
                pilot first?{" "}
                <a href="/signup" className="underline">
                    Create a pilot account
                </a>
                .
            </p>
        </form>
    );
}
