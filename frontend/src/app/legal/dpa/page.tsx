import type { Metadata } from "next";
import { productName } from "@clausemoor/client";
import { DPA_TEXT } from "../copy";

export const metadata: Metadata = {
    title: `Data Processing Addendum · ${productName()}`,
};

export default function DpaPage() {
    return (
        <article className="space-y-4 whitespace-pre-wrap text-sm leading-6">
            {DPA_TEXT}
        </article>
    );
}
