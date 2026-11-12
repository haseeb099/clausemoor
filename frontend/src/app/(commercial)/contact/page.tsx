import type { Metadata } from "next";
import { productName, salesEmail, supportEmail } from "@clausemoor/client";
import { ContactSalesForm } from "./ContactSalesForm";

export const metadata: Metadata = {
    title: `Contact sales · ${productName()}`,
    description:
        "Request a Chambers, Firm, or self-hosted Clausemoor contract for your law firm.",
};

type ContactPageProps = {
    searchParams?: Promise<{ plan?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
    const brand = productName();
    const params = searchParams ? await searchParams : {};
    return (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <section className="space-y-5 commercial-rise">
                <p className="font-serif text-4xl tracking-tight text-[var(--commercial-ink)] md:text-5xl">
                    {brand}
                </p>
                <div className="h-1 w-24 rounded-full bg-[var(--commercial-gold)] commercial-mark-line" />
                <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
                    Get your firm on board
                </h1>
                <p className="max-w-xl text-base leading-7 text-[color:rgb(27_58_75_/_0.78)] commercial-rise-delay">
                    Tell us which plan you want. We send an order form, DPA, and
                    onboarding steps. Hosted customers get a workspace URL;
                    self-hosted customers get an install package and support
                    contact.
                </p>
                <dl className="space-y-3 text-sm leading-6 text-[color:rgb(27_58_75_/_0.78)] commercial-rise-late">
                    <div>
                        <dt className="font-medium text-[var(--commercial-ink)]">
                            Sales
                        </dt>
                        <dd>
                            <a className="underline" href={`mailto:${salesEmail()}`}>
                                {salesEmail()}
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt className="font-medium text-[var(--commercial-ink)]">
                            Support
                        </dt>
                        <dd>
                            <a className="underline" href={`mailto:${supportEmail()}`}>
                                {supportEmail()}
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt className="font-medium text-[var(--commercial-ink)]">
                            How billing works
                        </dt>
                        <dd>
                            Invoice against an order form. No card checkout in
                            the app.
                        </dd>
                    </div>
                </dl>
            </section>

            <ContactSalesForm initialPlanId={params.plan} />
        </div>
    );
}
