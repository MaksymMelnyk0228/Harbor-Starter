# Harbor

Harbor is an online store for thoughtful goods — electronics, computers, home, and everyday carry.

**Requirement:** Node.js 20 or newer (`node -v`).

## Run locally (development)

```bash
npm install
npm run dev
```

Then open **http://127.0.0.1:5173** (or http://localhost:5173).

That is all most developers need. `npm run dev` will:

1. Create a `.env` file if you do not have one  
2. Generate the Prisma client and create the SQLite database  
3. Seed the catalog and staff account  
4. Download product photos if they are missing (needs network once)  
5. Start the API on port **3001** and the Vite storefront on port **5173**

Leave those two terminals / processes running while you work. Stop with `Ctrl+C`.

### If the page stays blank or “Opening the shop…”

- Confirm the API is up: open http://127.0.0.1:3001/api/health — you should see `{"ok":true}`  
- Use the URL printed in the terminal (Vite may pick **5174** if 5173 is busy)  
- Delete `.env` and run `npm run dev` again if an old `.env` set the wrong port  

### Staff login

| Role  | Email           | Password |
|-------|-----------------|----------|
| Admin | admin@harbor.co | admin123 |

Dashboard: http://127.0.0.1:5173/admin  

Create a customer account from **Sign in → Create an account**.

---

## Run as a single production-style server

```bash
npm install
npm start
```

Open **http://localhost:3000**.

`npm start` prepares the database, builds the storefront, and serves API + website together on one port.

---

## Other commands

```bash
npm run build    # typecheck / build packages
npm run test     # API tests
npm run setup    # env + database + seed only (no servers)
npm run images   # re-download product photos
```

## Project layout

```text
apps/web      React storefront + merchant dashboard (Vite)
apps/api      Express API, checkout, payments
packages/shared   Shared money / payment types
prisma/       Schema + seed data (SQLite)
scripts/      npm run dev / start helpers
```

## Environment

Copying `.env.example` is optional — `npm run dev` and `npm start` create `.env` for you.

Do **not** set `PORT=3000` in `.env` when using `npm run dev`. Development always uses:

- API → `3001` (Vite proxies `/api` and `/images` here)  
- Storefront → `5173` (or the next free port)

Optional variables:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET=harbor-local-secret
JWT_EXPIRES_IN=7d
HOST=0.0.0.0
```

For `npm start` only, you can set `PORT` (default `3000`) and `CLIENT_ORIGIN`.

## Payments

Card numbers are not stored — only brand and last four digits. Test decline card: `4000000000000002`. Other well-formed cards succeed in the local card provider.

## Architecture

```text
React storefront → Express → Services → Prisma → SQLite
```
