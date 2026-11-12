# Go-to-market launch checklist

This is the operator checklist for putting a first UK or EU law-firm customer onto Clausemoor. The product ships commercial plans, a public pricing page, a sales contact path, and an order-form template. Hosting, solicitor review, and live secrets remain operator work.

## Already in the product

- Published list plans: Pilot, Chambers (£499/mo or £4,990/yr), Firm (£1,490/mo or £14,900/yr), Self-hosted (from £24,000/yr). Edit [frontend/config/plans.json](../frontend/config/plans.json) if your prices change.
- Public `/pricing` and `/contact` pages, linked from login, signup, settings, and legal navigation.
- Stripe Checkout for hosted Chambers / Firm when `STRIPE_SECRET_KEY` is set (`POST /billing/checkout`, webhook `POST /billing/webhook`). Self-hosted and custom deals stay on invoice.
- Invoice / order-form path still available from Contact sales.
- Order form template: [docs/legal/order-form.md](legal/order-form.md).
- Legal templates: [docs/legal/terms.md](legal/terms.md), [privacy.md](legal/privacy.md), [dpa.md](legal/dpa.md), also served at `/legal/*`.
- Brand and sales env: `PRODUCT_NAME`, `SUPPORT_EMAIL`, `SALES_EMAIL`, legal URLs, `SOURCE_CODE_URL`.
- Hosted and self-hosted deployment guides: [deployment-saas.md](deployment-saas.md), [self-hosted.md](self-hosted.md).
- Upstream Sentry off unless you set your own DSNs.
- AGPL source offer in the app footer/settings.

## Before the first paying customer

1. Merge the rebrand PR and deploy a production build with HTTPS on your domain.
2. Replace every secret in `.env` / `backend/.env`. Do not use the Compose demo Supabase keys on the public internet.
3. Provision UK or EU Postgres, object storage, SMTP, and funded model API keys.
4. Set `SUPPORT_EMAIL` and `SALES_EMAIL` to inboxes you monitor.
5. Have a UK solicitor finalise Terms, Privacy, DPA, and the order form. Replace placeholders and remove the TEMPLATE banner.
6. Publish a subprocessor list URL and put it in the DPA and order form.
7. For card sales: create a Stripe account (UK), set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`, and point the webhook at `https://<your-api>/billing/webhook` for `checkout.session.completed` and `customer.subscription.*`. For invoice-only deals, fill bank details on the order form instead.
8. Create the customer's hosted workspace **or** run the self-hosted install with them.
9. Optionally publish `ghcr.io/haseeb099/clausemoor-*` images from `main`, or support `docker compose up --build`.
10. Optionally set your own `SENTRY_DSN` / `FRONTEND_SENTRY_DSN`.

## First-customer playbook

1. Prospect creates a Pilot account at `/signup`, or emails sales from `/contact`.
2. You send the reviewed order form + terms (+ DPA for hosted).
3. They sign and pay the invoice.
4. For card checkout, Stripe webhooks set `user_profiles.tier` to Chambers or Firm. For invoice deals, set the plan in your ops notes after payment clears.
5. You run a short onboarding call: users, Word add-in, model keys, support mailbox.
6. Confirm `SOURCE_CODE_URL` points at the exact version they run.

Until steps 1–7 above are done, treat the product as ready to demo and paper-pilot, not as a finished regulated commercial offer.
