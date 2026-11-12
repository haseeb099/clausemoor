import type { Metadata } from "next";
import { productName } from "@clausemoor/client";
import { TERMS_TEXT } from "../copy";

export const metadata: Metadata = {
    title: `Terms of Service · ${productName()}`,
};

export default function TermsPage() {
    return (
        <article className="space-y-4 whitespace-pre-wrap text-sm leading-6">
            {TERMS_TEXT}
        </article>
    );
}
