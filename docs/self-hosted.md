# Self-hosted install

Use this when a client runs Clausemoor on their own servers and you sell a support contract. You are not the host of their documents. Do not use the hosted DPA for that data. Your support contract should say what you can see (for example, logs they send you) and what you cannot.

The application is the same Docker Compose stack as local development, with production values instead of the demo keys.

## What the client provides

- A Linux host with Docker Engine and the Compose plugin, or a small VM per service if they split the stack.
- A DNS name and a TLS certificate for the web app.
- Outbound HTTPS to the model provider they choose, unless they run Ollama on their network.
- A decision on region. For a UK firm, keep the VM, disks, and backups in the UK or the EEA.
- Someone who can read logs and restart containers. Your support contract can be that someone.

## Install

On the server, as a user who can run Docker:

```bash
git clone https://github.com/haseeb099/clausemoor.git
cd clausemoor
git checkout <the tag or commit you support>
cp .env.example .env
cp backend/.env.example backend/.env
```

Edit both files:

- Replace every generated secret. `openssl rand -hex 32` for `DOWNLOAD_SIGNING_SECRET`, `USER_API_KEYS_ENCRYPTION_SECRET`, and `AUTH_HANDOFF_ENCRYPTION_SECRET`. Change the Postgres password and JWT secret together, and regenerate the anon and service-role keys so they match. The values in `.env.example` are public demo keys.
- Set `NODE_ENV=production` only after `FRONTEND_URL` and `API_PUBLIC_URL` are `https://` URLs the users' browsers can open.
- Set `FRONTEND_URL` to the public origin, for example `https://clausemoor.client.example`.
- Set `R2_PUBLIC_ENDPOINT_URL` to an `https` URL that browsers can use to reach object storage, or front storage with the same proxy. The default `localhost` port only works on the machine itself.
- Set `GOTRUE_MAILER_AUTOCONFIRM=false` and point Auth SMTP at the client's mail server. Local Mailpit is only for a lab.
- Put the model API key in `backend/.env`, or leave it empty and have each user save a key in Settings.
- Set `SUPPORT_EMAIL` to the support address in your contract.
- Leave `SENTRY_DSN` and `FRONTEND_SENTRY_DSN` empty, or set them to a project the client controls. Do not send a client's errors to your project unless the contract says so, and do not send them to any third-party project by default.
- Set `SOURCE_CODE_URL` to https://github.com/haseeb099/clausemoor or to a mirror that serves this exact commit. The footer link has to offer the source of the version they are running.

Start it:

```bash
docker compose up --build -d
```

The first boot applies `backend/schema.sql` on an empty database and then runs migrations. Later upgrades are `git pull` of a commit you support, then `docker compose up --build -d`. The migration runner records checksums. Do not edit files in `backend/migrations` on a database that has already applied them.

Open the public URL, create the first admin user, and confirm mail delivery.

## Ports

Compose binds the database, Redis, and storage admin ports to loopback in the sample file. Keep it that way on a client server. Publish only the HTTPS proxy in front of port 3000.

| Service | Sample port | Who should reach it |
| --- | --- | --- |
| Web app | 3000 | Users, through TLS |
| API | 3001 | Only the web container, unless you terminate TLS yourself |
| Postgres | 54322 on localhost | Operators on the host |
| Mailpit | 8025 | Lab only. Turn it off in production |
| Object storage | 9000 | Browsers only through the URL you set for uploads |

## Backups

Back up the Postgres volume and the object-storage volume on a schedule the client accepts. A backup that has never been restored is not a backup. Test a restore onto a spare VM before you call the install done.

## Support contract

Agree in writing:

- Which git tag you support, and how upgrades are scheduled.
- The hours you answer, and the mailbox (`SUPPORT_EMAIL`).
- That you do not have standing access to the server. If you need access for an incident, the client grants it for that incident.
- That matter documents are not copied to you as part of ordinary support.
- That the client is responsible for their model-provider account, their Microsoft 365 admin consent for the Word add-in, and their user administration.

## Word add-in and desktop

The Word manifest is `word-addin/manifest.xml`. Build the add-in with `REACT_APP_WEB_APP_URL` set to the client's URL. The desktop app is a Mac shell; its default server URL is `https://app.clausemoor.com` until the user points it at the client's server.

## Licence

Self-hosting does not remove the AGPL. Users of the network service still need the source offer. Keep the **Source code** link working. See [NOTICE](../NOTICE) and [LICENSE](../LICENSE).

Clausemoor is based on the open-source Mike project by Open Legal Products, Inc., licensed under AGPL-3.0.
