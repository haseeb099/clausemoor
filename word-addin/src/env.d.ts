/// <reference types="office-js" />

/**
 * Ambient declaration for webpack EnvironmentPlugin substitutions.
 * These values are replaced while webpack builds the task-pane bundle.
 */
declare const process: {
  readonly env: {
    readonly REACT_APP_API_BASE_URL: string | undefined;
    readonly REACT_APP_DEFAULT_MODEL: string | undefined;
    readonly REACT_APP_WEB_APP_URL: string | undefined;
    readonly REACT_APP_PRODUCT_NAME: string | undefined;
    readonly REACT_APP_SUPPORT_EMAIL: string | undefined;
    readonly REACT_APP_SALES_EMAIL: string | undefined;
    readonly REACT_APP_TERMS_URL: string | undefined;
    readonly REACT_APP_PRIVACY_URL: string | undefined;
    readonly REACT_APP_DPA_URL: string | undefined;
    readonly REACT_APP_SOURCE_CODE_URL: string | undefined;
    readonly REACT_APP_APP_URL: string | undefined;
    readonly REACT_APP_MARKETING_URL: string | undefined;
    readonly NEXT_PUBLIC_PRODUCT_NAME: string | undefined;
    readonly NEXT_PUBLIC_SUPPORT_EMAIL: string | undefined;
    readonly NEXT_PUBLIC_SALES_EMAIL: string | undefined;
    readonly NEXT_PUBLIC_TERMS_URL: string | undefined;
    readonly NEXT_PUBLIC_PRIVACY_URL: string | undefined;
    readonly NEXT_PUBLIC_DPA_URL: string | undefined;
    readonly NEXT_PUBLIC_SOURCE_CODE_URL: string | undefined;
    readonly NEXT_PUBLIC_APP_URL: string | undefined;
    readonly NEXT_PUBLIC_MARKETING_URL: string | undefined;
    readonly PRODUCT_NAME: string | undefined;
    readonly SUPPORT_EMAIL: string | undefined;
    readonly SALES_EMAIL: string | undefined;
    readonly TERMS_URL: string | undefined;
    readonly PRIVACY_URL: string | undefined;
    readonly DPA_URL: string | undefined;
    readonly SOURCE_CODE_URL: string | undefined;
    readonly APP_URL: string | undefined;
    readonly MARKETING_URL: string | undefined;
    readonly REACT_APP_SENTRY_DISABLED: string | undefined;
    readonly REACT_APP_SENTRY_DSN: string | undefined;
    readonly REACT_APP_SENTRY_INSTALL: string | undefined;
    readonly REACT_APP_SENTRY_ENVIRONMENT: string | undefined;
    readonly REACT_APP_SENTRY_RELEASE: string | undefined;
    readonly REACT_APP_GIT_SHA: string | undefined;
    readonly REACT_APP_MIKE_VERSION: string | undefined;
    readonly REACT_APP_SENTRY_MAX_REPEAT_EVENTS_PER_DAY: string | undefined;
    readonly REACT_APP_SENTRY_TRACES_SAMPLE_RATE: string | undefined;
    readonly NODE_ENV: string;
  };
};
