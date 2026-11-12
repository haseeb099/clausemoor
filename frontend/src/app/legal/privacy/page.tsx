import type { Metadata } from "next";
import { productName } from "@clausemoor/client";
import { PRIVACY_TEXT } from "../copy";

export const metadata: Metadata = {
    title: `Privacy Policy · ${productName()}`,
};

export default function PrivacyPage() {
    return (
        <article className="space-y-4 whitespace-pre-wrap text-sm leading-6">
            {PRIVACY_TEXT}
        </article>
    );
}
