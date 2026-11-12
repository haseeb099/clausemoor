/**
 * Operator-facing brand. Defaults are Clausemoor. A deployment overrides them
 * with PRODUCT_NAME, SUPPORT_EMAIL, TERMS_URL, PRIVACY_URL, DPA_URL,
 * SOURCE_CODE_URL, APP_URL, and MARKETING_URL.
 *
 * The browser build only sees the NEXT_PUBLIC_ or REACT_APP_ names, because
 * those are the ones Next.js and the add-in bundler inline. Each name is
 * referenced directly so the bundler can replace it.
 */

function firstDefined(values: Array<string | undefined>): string | undefined {
    for (const value of values) {
        const trimmed = value?.trim();
        if (trimmed) return trimmed;
    }
    return undefined;
}

export const DEFAULT_PRODUCT_NAME = "Clausemoor";
export const DEFAULT_SUPPORT_EMAIL = "support@clausemoor.com";
export const DEFAULT_SOURCE_CODE_URL =
    "https://github.com/haseeb099/clausemoor";
export const DEFAULT_TERMS_URL = "/legal/terms";
export const DEFAULT_PRIVACY_URL = "/legal/privacy";
export const DEFAULT_DPA_URL = "/legal/dpa";
export const DEFAULT_APP_URL = "https://app.clausemoor.com";
export const DEFAULT_MARKETING_URL = "https://clausemoor.com";

/** Required AGPL notice. Keep this sentence factual; do not use it as a logo. */
export const ATTRIBUTION_LINE =
    "Clausemoor is based on the open-source Mike project by Open Legal Products, Inc., licensed under AGPL-3.0.";

export function productName(): string {
    return (
        firstDefined([
            process.env.NEXT_PUBLIC_PRODUCT_NAME,
            process.env.REACT_APP_PRODUCT_NAME,
            process.env.PRODUCT_NAME,
        ]) ?? DEFAULT_PRODUCT_NAME
    );
}

export function supportEmail(): string {
    return (
        firstDefined([
            process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
            process.env.REACT_APP_SUPPORT_EMAIL,
            process.env.SUPPORT_EMAIL,
        ]) ?? DEFAULT_SUPPORT_EMAIL
    );
}

export function termsUrl(): string {
    return (
        firstDefined([
            process.env.NEXT_PUBLIC_TERMS_URL,
            process.env.REACT_APP_TERMS_URL,
            process.env.TERMS_URL,
        ]) ?? DEFAULT_TERMS_URL
    );
}

export function privacyUrl(): string {
    return (
        firstDefined([
            process.env.NEXT_PUBLIC_PRIVACY_URL,
            process.env.REACT_APP_PRIVACY_URL,
            process.env.PRIVACY_URL,
        ]) ?? DEFAULT_PRIVACY_URL
    );
}

export function dpaUrl(): string {
    return (
        firstDefined([
            process.env.NEXT_PUBLIC_DPA_URL,
            process.env.REACT_APP_DPA_URL,
            process.env.DPA_URL,
        ]) ?? DEFAULT_DPA_URL
    );
}

export function sourceCodeUrl(): string {
    return (
        firstDefined([
            process.env.NEXT_PUBLIC_SOURCE_CODE_URL,
            process.env.REACT_APP_SOURCE_CODE_URL,
            process.env.SOURCE_CODE_URL,
        ]) ?? DEFAULT_SOURCE_CODE_URL
    );
}

export function appUrl(): string {
    return (
        firstDefined([
            process.env.NEXT_PUBLIC_APP_URL,
            process.env.REACT_APP_APP_URL,
            process.env.APP_URL,
        ]) ?? DEFAULT_APP_URL
    );
}

export function marketingUrl(): string {
    return (
        firstDefined([
            process.env.NEXT_PUBLIC_MARKETING_URL,
            process.env.REACT_APP_MARKETING_URL,
            process.env.MARKETING_URL,
        ]) ?? DEFAULT_MARKETING_URL
    );
}
