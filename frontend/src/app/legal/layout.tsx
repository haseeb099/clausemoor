import type { ReactNode } from "react";
import Link from "next/link";
import { SourceNotice } from "@/app/components/SourceNotice";

export default function LegalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-dvh bg-white text-gray-900">
            <header className="border-b border-gray-200 px-6 py-4">
                <nav className="mx-auto flex max-w-3xl flex-wrap gap-4 text-sm">
                    <Link href="/legal/terms" className="underline">
                        Terms
                    </Link>
                    <Link href="/legal/privacy" className="underline">
                        Privacy
                    </Link>
                    <Link href="/legal/dpa" className="underline">
                        DPA
                    </Link>
                    <Link href="/login" className="underline">
                        Sign in
                    </Link>
                </nav>
            </header>
            <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
            <div className="mx-auto max-w-3xl px-6 pb-16">
                <SourceNotice detailed />
            </div>
        </div>
    );
}
