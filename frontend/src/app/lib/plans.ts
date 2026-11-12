import { salesEmail } from "@clausemoor/client";
import catalog from "../../../config/plans.json";

export type PlanCtaKind = "signup" | "contact";

export type CommercialPlan = {
    id: string;
    name: string;
    audience: string;
    priceMonthly: number | null;
    priceAnnual: number | null;
    priceLabel: string;
    billingPeriod: string;
    highlighted: boolean;
    cta: { label: string; kind: PlanCtaKind };
    seats: string;
    deployment: string;
    features: string[];
};

export type PlansCatalog = {
    currency: string;
    billingModel: string;
    vatNote: string;
    responseSla: string;
    note: string;
    plans: CommercialPlan[];
};

export const plansCatalog = catalog as PlansCatalog;

export function planById(id: string): CommercialPlan | undefined {
    return plansCatalog.plans.find((plan) => plan.id === id);
}

export function formatGbp(amount: number): string {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: plansCatalog.currency,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function salesMailto(input: {
    planId?: string;
    firmName?: string;
    contactName?: string;
    contactEmail?: string;
    seats?: string;
    notes?: string;
}): string {
    const plan = input.planId ? planById(input.planId) : undefined;
    const subject = plan
        ? `Clausemoor ${plan.name} enquiry`
        : "Clausemoor sales enquiry";
    const lines = [
        "Hello Clausemoor sales,",
        "",
        "I would like to discuss getting our firm onto Clausemoor.",
        "",
        `Plan: ${plan?.name ?? "Not sure yet"}`,
        `Firm: ${input.firmName?.trim() || ""}`,
        `Contact: ${input.contactName?.trim() || ""}`,
        `Email: ${input.contactEmail?.trim() || ""}`,
        `Seats: ${input.seats?.trim() || ""}`,
        "",
        "Notes:",
        input.notes?.trim() || "",
        "",
        "Please send an order form / next steps.",
    ];
    // Use encodeURIComponent so spaces stay as %20 (URLSearchParams uses +).
    return `mailto:${salesEmail()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
