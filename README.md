# Clausemoor

Clausemoor is a legal AI workspace for law firms. Teams use it to review documents, draft, run playbooks and tabular reviews, and work from Microsoft Word. It is built for two ways of selling:

- **Hosted SaaS.** You run Clausemoor and firms subscribe.
- **Self-hosted.** You install it on a client's servers and sell a support contract.

Clausemoor is based on the open-source Mike project by Open Legal Products, Inc., licensed under AGPL-3.0.

## Features

- Assistant chat over matters and documents, with citations
- Document review and suggested edits, including tracked changes
- Tabular review across a set of documents
- Reusable workflows and playbooks
- Projects, a document library, and organisation workspaces
- Microsoft Word task-pane add-in
- Desktop shell for Mac
- Bring-your-own model keys (Anthropic, OpenAI, Gemini, and others) and optional local models through Ollama
- UK/EU-oriented deployment notes for a hosted service and for a customer install

## Quick start

You need Docker, and one model API key.

```bash
cp .env.example .env
cp backend/.env.example backend/.env
openssl rand -hex 32   # use a fresh value for each required secret
```

In `backend/.env`, replace `DOWNLOAD_SIGNING_SECRET` and `USER_API_KEYS_ENCRYPTION_SECRET`, and set an Anthropic, OpenAI, or Gemini key.

```bash
docker compose up --build
```

Open http://localhost:3000 and create an account. Mailpit catches local mail at http://localhost:8025.

Stop the stack with `npm run stack:down`. The local Supabase keys in `.env.example` are public demo keys. Do not expose that stack to the internet. See [docs/self-hosted.md](docs/self-hosted.md) and [docs/deployment-saas.md](docs/deployment-saas.md).

## Deployment options

| | Hosted SaaS | Self-hosted |
| --- | --- | --- |
| Who runs the servers | You | The client |
| What you sell | A subscription | An install plus a support contract |
| Guide | [docs/deployment-saas.md](docs/deployment-saas.md) | [docs/self-hosted.md](docs/self-hosted.md) |
| Customer data | On your hosting, under the DPA | On the client's servers |

Set `PRODUCT_NAME`, `SUPPORT_EMAIL`, `TERMS_URL`, `PRIVACY_URL`, `DPA_URL`, and `SOURCE_CODE_URL` before you go live. The legal pages under `/legal` and [docs/legal](docs/legal) are templates. Have a UK solicitor review them. Plan names live in [frontend/config/plans.json](frontend/config/plans.json). This build does not take card payments.

Error reporting is **off** until you set `SENTRY_DSN` and `FRONTEND_SENTRY_DSN` to your own Sentry projects. Nothing is sent to the upstream project.

## Development

Node.js 22.19 or newer.

```bash
cd frontend && npm ci && npm run typecheck && npm run lint && npm test
cd ../backend && npm ci && npm run build && npm test
```

`npm run build` in `frontend` produces the production web app. The Word add-in is `word-addin` (`npm run typecheck` and `npm run build`). The Mac shell is `desktop`.

## Licence and attribution

Clausemoor is licensed under the GNU Affero General Public License version 3. See [LICENSE](LICENSE). Anyone who uses a modified version over a network must be able to get the corresponding source. The app shows a **Source code** link, aimed at `SOURCE_CODE_URL` (default: https://github.com/haseeb099/clausemoor).

Copyright notices from the upstream project are kept. See [NOTICE](NOTICE) and [CREDITS.md](CREDITS.md).

Clausemoor is based on the open-source Mike project by Open Legal Products, Inc., licensed under AGPL-3.0.

Third-party document libraries and their notices are listed in CREDITS.md. Workflow templates synced from the upstream catalog keep that catalog's own licence.
