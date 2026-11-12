import type { ReactNode } from "react";
import Link from "next/link";
import { productName, termsUrl, privacyUrl, dpaUrl } from "@clausemoor/client";
import { SiteLogo } from "@/app/components/site-logo";
import { SourceNotice } from "@/app/components/SourceNotice";
import "./commercial.css";

export default function CommercialLayout({ children }: { children: ReactNode }) {
    const brand = productName();
    return (
        <div className="commercial-shell min-h-dvh text-[var(--commercial-ink)]">
            <header className="relative z-10 border-b border-[color:rgb(27_58_75_/_0.12)] px-6 py-5">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <SiteLogo size="md" />
                    <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm text-[color:rgb(27_58_75_/_0.78)]">
                        <Link href="/pricing" className="hover:text-[var(--commercial-ink)]">
                            Pricing
                        </Link>
                        <Link href="/contact" className="hover:text-[var(--commercial-ink)]">
                            Contact sales
                        </Link>
                        <Link href="/legal/terms" className="hover:text-[var(--commercial-ink)]">
                            Terms
                        </Link>
                        <Link
                            href="/signup"
                            className="rounded-md bg-[var(--commercial-ink)] px-3 py-1.5 font-medium text-[var(--commercial-paper)] transition-opacity hover:opacity-90"
                        >
                            Start pilot
                        </Link>
                        <Link href="/login" className="hover:text-[var(--commercial-ink)]">
                            Sign in
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
                {children}
            </main>
            <footer className="relative z-10 border-t border-[color:rgb(27_58_75_/_0.12)] px-6 py-8">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[color:rgb(27_58_75_/_0.72)] md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <p className="font-serif text-lg text-[var(--commercial-ink)]">
                            {brand}
                        </p>
                        <p>Legal AI for UK and EU law firms.</p>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        <Link href={termsUrl()}>Terms</Link>
                        <Link href={privacyUrl()}>Privacy</Link>
                        <Link href={dpaUrl()}>DPA</Link>
                        <Link href="/pricing">Pricing</Link>
                        <Link href="/contact">Sales</Link>
                    </div>
                </div>
                <div className="mx-auto mt-8 max-w-6xl">
                    <SourceNotice detailed />
                </div>
            </footer>
        </div>
    );
}
