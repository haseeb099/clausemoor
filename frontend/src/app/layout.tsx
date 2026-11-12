import type { Metadata } from "next";
import { appUrl, productName } from "@clausemoor/client";
// Self-hosted Inter and EB Garamond; sets --font-inter and --font-eb-garamond.
import "./fonts/fonts.css";
import "./globals.css";
import { Providers } from "@/app/components/providers";
import { SourceNotice } from "@/app/components/SourceNotice";

const brand = productName();
const publicAppUrl = appUrl();

export const metadata: Metadata = {
    metadataBase: new URL(publicAppUrl),
    title: `${brand} - Legal AI Platform`,
    description:
        "AI-powered legal document analysis and contract review platform.",
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico" },
        ],
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        type: "website",
        url: publicAppUrl,
        siteName: brand,
        title: `${brand} - Legal AI Platform`,
        description:
            "AI-powered legal document analysis and contract review platform.",
        images: [
            {
                url: "/link-image.jpg",
                width: 1200,
                height: 651,
                alt: brand,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${brand} - Legal AI Platform`,
        description:
            "AI-powered legal document analysis and contract review platform.",
        images: ["/link-image.jpg"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className="font-sans antialiased"
            >
                <Providers>{children}</Providers>
                <SourceNotice />
            </body>
        </html>
    );
}
