/**
 * Runtime brand for emails, system prompts, and logs.
 * Mirrors packages/client/src/brand.ts. The backend image does not import
 * that package, so the defaults live here too.
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
export const DEFAULT_SALES_EMAIL = "sales@clausemoor.com";
export const DEFAULT_SOURCE_CODE_URL = "https://github.com/haseeb099/clausemoor";

export function productName(): string {
  return firstDefined([process.env.PRODUCT_NAME]) ?? DEFAULT_PRODUCT_NAME;
}

export function supportEmail(): string {
  return firstDefined([process.env.SUPPORT_EMAIL]) ?? DEFAULT_SUPPORT_EMAIL;
}

export function salesEmail(): string {
  return firstDefined([process.env.SALES_EMAIL]) ?? DEFAULT_SALES_EMAIL;
}

export function sourceCodeUrl(): string {
  return firstDefined([process.env.SOURCE_CODE_URL]) ?? DEFAULT_SOURCE_CODE_URL;
}
