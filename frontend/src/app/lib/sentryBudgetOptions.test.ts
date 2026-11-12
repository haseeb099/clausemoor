import { expect, it, vi } from "vitest";
import { serverSentryOptions } from "./errorReporting";
import { addinSentryOptions } from "../../../../word-addin/src/taskpane/lib/errorReporting";

const OWN_DSN = "https://own@sentry.invalid/42";

it.each(["server", "edge", "addin"] as const)("%s does not apply an upstream daily cap to the operator's project", async runtime => {
    for (const [dsn, count] of [[OWN_DSN, 60]] as const) {
        const options = runtime === "addin"
            ? addinSentryOptions("taskpane", { nodeEnv: "production", dsn })
            : serverSentryOptions(runtime, { NODE_ENV: "production", SENTRY_DSN: dsn });
        const integrations = options.integrations;
        if (!Array.isArray(integrations)) throw new Error("Expected explicit integrations");
        const integration = integrations.find(item => item.name === "ClausemoorPrivacyBoundary");
        const send = vi.fn<(envelope: unknown) => Promise<{ statusCode: number }>>(async () => ({ statusCode: 200 }));
        const transport = { send };
        // Drive the configured final transport, not a separately constructed budget.
        (integration as unknown as { setup(client: unknown): void }).setup({ getTransport: () => transport });
        for (let n = 0; n < 60; n++) await transport.send([{}, [[{ type: "event" }, { message: "PRIVATE_QUOTA_CANARY", tags: { diagnostic_test: "true" } }]]]);
        expect(send).toHaveBeenCalledTimes(count);
        expect(JSON.stringify(send.mock.calls)).not.toContain("PRIVATE_QUOTA_CANARY");
    }
});

it.each(["server", "addin"] as const)("%s bounds legacy-server 503 copies and reserves capacity for a new failure", async runtime => {
    let at = 0;
    const clock = vi.spyOn(Date, "now").mockImplementation(() => at);
    try {
        const options = runtime === "addin"
            ? addinSentryOptions("taskpane", { nodeEnv: "production", dsn: OWN_DSN })
            : serverSentryOptions("server", { NODE_ENV: "production", SENTRY_DSN: OWN_DSN });
        if (!Array.isArray(options.integrations)) throw new Error("Expected explicit integrations");
        const integration = options.integrations.find(item => item.name === "ClausemoorPrivacyBoundary");
        const send = vi.fn<(envelope: unknown) => Promise<{ statusCode: number }>>(async () => ({ statusCode: 200 }));
        const transport = { send };
        (integration as unknown as { setup(client: unknown): void }).setup({ getTransport: () => transport });
        for (let hour = 0; hour < 23; hour++) {
            at = hour * 61 * 60_000;
            for (const code of ["upstream_unavailable", "schema_out_of_date"]) {
                // Older servers provide the code without a reporting owner.
                await transport.send([{}, [[{ type: "event" }, { level: "error", tags: {
                    operation: "api.request", http_status: 503, error_code: code,
                    http_route: code === "upstream_unavailable" ? "/projects" : "/documents",
                } }]]]);
            }
        }
        expect(send).toHaveBeenCalledTimes(46);
        await transport.send([{}, [[{ type: "event" }, { level: "error", tags: { operation: "documents.upload" } }]]]);
        expect(send).toHaveBeenCalledTimes(47);
    } finally { clock.mockRestore(); }
});
