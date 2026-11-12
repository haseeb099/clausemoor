import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContactSalesForm } from "./ContactSalesForm";

describe("ContactSalesForm", () => {
    beforeEach(() => {
        Object.defineProperty(window, "location", {
            configurable: true,
            value: { href: "" },
        });
    });

    it("prefills the requested plan and opens a sales mailto", async () => {
        const user = userEvent.setup();
        render(<ContactSalesForm initialPlanId="firm" />);

        expect(screen.getByLabelText("Plan")).toHaveValue("firm");
        await user.type(screen.getByLabelText("Firm name"), "North Bridge LLP");
        await user.type(screen.getByLabelText("Your name"), "Sam Partner");
        await user.type(screen.getByLabelText("Work email"), "sam@northbridge.test");
        await user.click(screen.getByRole("button", { name: "Email sales" }));

        expect(window.location.href).toContain("mailto:sales@clausemoor.com");
        expect(decodeURIComponent(window.location.href)).toContain("North Bridge LLP");
        expect(decodeURIComponent(window.location.href)).toContain("Firm");
    });
});
