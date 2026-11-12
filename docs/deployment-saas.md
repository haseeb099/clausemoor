# Hosted SaaS deployment (UK and EU)

This is how to run Clausemoor as a subscription service for law firms. It is an operator's checklist, not a security certificate. Have a UK solicitor review [the legal templates](legal/) before you take payment, and agree the hosting region in the contract.

## What you are operating

You host the web app, the API, Postgres (Supabase), object storage, and Redis. Firms sign in to your URL. Their documents sit on your infrastructure, so you are their processor for that data. The [DPA template](legal/dpa.md) is written for this case.

A self-hosted client install is a different product. Use [self-hosted.md](self-hosted.md) for that.

## Region

Pick a UK or EU region and keep the database, object storage, backups, and the application in that region. If a language-model provider processes prompts outside the UK, name the country in the privacy policy and put a UK transfer tool in place (IDTA, or the UK Addendum to the EU SCCs, plus the EU SCCs where an EEA customer needs them). Do not leave the demo Supabase keys from `.env.example` in a public deployment.

## Minimum production configuration

1. Copy `.env.example` to the secret store your host uses, and `backend/.env.example` to the API environment.
2. Generate new secrets. At least `DOWNLOAD_SIGNING_SECRET`, `USER_API_KEYS_ENCRYPTION_SECRET`, `AUTH_HANDOFF_ENCRYPTION_SECRET`, the JWT secret, and the database password. `openssl rand -hex 32` for the hex secrets.
3. Set real Supabase URL and keys for a project in your chosen region, or run the Compose database privately with no public ports.
4. Set `NODE_ENV=production`, `FRONTEND_URL` and `API_PUBLIC_URL` to `https://` URLs on your domain.
5. Put TLS in front of the web app. Do not publish Postgres, Redis, or storage to the internet.
6. Set `GOTRUE_MAILER_AUTOCONFIRM=false` and a real SMTP service. Autoconfirm lets anyone claim an email address.
7. Set one model provider key, or require each firm to save their own key in settings.
8. Leave `SENTRY_DSN` and `FRONTEND_SENTRY_DSN` empty until you have created **your** Sentry projects. Do not point them at anyone else's DSN.
9. Set the brand variables: `PRODUCT_NAME`, `SUPPORT_EMAIL`, `TERMS_URL`, `PRIVACY_URL`, `DPA_URL`, `SOURCE_CODE_URL`, `APP_URL`, `MARKETING_URL`. The web image bakes the `NEXT_PUBLIC_` copies at build time, so pass them as Compose build args (already wired) and rebuild when they change.
10. Replace the placeholder plans in `frontend/config/plans.json` when you are ready to describe packages. Wire a payment provider yourself. This repository does not charge cards.

`SOURCE_CODE_URL` must stay a place where users of the hosted service can download the corresponding source of the version you are running, including your changes. The default is https://github.com/haseeb099/clausemoor. If you deploy a commit that is not pushed, publish that source another way and point the variable at it. The AGPL requires this for network use.

## Compose

From a checkout of the version you intend to run:

```bash
docker compose up --build -d
```

The published image names in Compose are `ghcr.io/haseeb099/clausemoor-backend` and `ghcr.io/haseeb099/clausemoor-frontend`. Those registries are empty until you publish images. Build from this checkout until you do.

See [deployment.md](deployment.md) for the service map, migrations, and object-storage CORS. Read the Sentry section there together with [observability.md](observability.md): reporting is off unless you set a DSN.

## Before the first firm

- Solicitor-approved terms, privacy policy, and DPA, linked from signup.
- A list of subprocessors (host, database, storage, email, model providers) in the privacy policy and DPA.
- A backup and restore test for Postgres and object storage.
- An account-deletion and export check (Settings → Privacy).
- A support mailbox that matches `SUPPORT_EMAIL`.
- Your own Sentry projects, if you want error reports, with the default privacy scrubbers left on.
- A record of which image tag and git SHA is in production, so the source offer matches the running code.

## Word add-in

Build `word-addin` with `REACT_APP_WEB_APP_URL` set to the hosted app and `REACT_APP_SOURCE_CODE_URL` set to the same source offer. The manifest id is `7c4e1a92-6b0d-4f58-9c3e-2a8d5f0b1e47`, which is not the upstream add-in's id. Sideload or submit that manifest through Microsoft 365 admin. Icons in `word-addin/assets` are the Clausemoor mark.
