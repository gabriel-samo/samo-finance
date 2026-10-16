<div align="center">

# Samo Finance

**A personal finance dashboard for tracking income, expenses, accounts, and spending habits.**

Built with Next.js, TypeScript, Hono, Clerk, Drizzle ORM, and Neon PostgreSQL.

[**Live App**](https://samo-finance.pages.dev/) · [**Source Code**](https://github.com/gabriel-samo/samo-finance)

</div>

![Samo Finance dashboard preview showing balance, income, expenses, and spending charts](docs/screenshots/dashboard.png)

> **See the app before signing up.** The screenshots below show the product's main workflows using **fictional sample data**. These are illustrative previews based on the project's UI, not screenshots of a real user's account. The live application requires authentication to access personal financial data.

## Product Preview

### Transactions

Add, edit, filter, and delete transactions. Review income and spending across your accounts in a sortable, searchable table.

![Transactions page with example income and expenses](docs/screenshots/transactions.png)

### Import Bank Statements (CSV)

Upload a CSV file, match its columns to the required transaction fields, and choose the account to import into. A sample file is included in the repository: [`exampleBankStatment.csv`](exampleBankStatment.csv).

![CSV import workflow showing column mapping for date, payee, and amount](docs/screenshots/csv-import.png)

### Manage Accounts

Create and manage the accounts you use to organize transactions.

![Accounts page showing fictional sample accounts](docs/screenshots/accounts.png)

## Features

- **Financial overview:** see remaining balance, income, expenses, and changes compared with the previous period.
- **Interactive analytics:** view income and expenses with area, line, or bar charts; explore category spending with pie, radar, or radial charts.
- **Date and account filters:** focus the dashboard on a specific period or account.
- **Transaction management:** create, edit, delete, search, sort, and bulk-delete transactions.
- **CSV imports:** map CSV columns to transaction fields and import multiple records into a selected account.
- **Accounts and categories:** create, edit, and manage custom accounts and spending categories.
- **Authentication:** sign in with Clerk; application API handlers associate financial records with the authenticated user.
- **Responsive interface:** built with Tailwind CSS and reusable UI components.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| UI | Tailwind CSS, shadcn/ui-style components, Radix UI, Framer Motion |
| Charts | Recharts |
| Forms and validation | React Hook Form, Zod |
| State and data fetching | TanStack Query, Zustand |
| Data tables | TanStack Table |
| API | Hono, Next.js route handlers |
| Database | Neon PostgreSQL, Drizzle ORM |
| Authentication | Clerk |

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- A [Neon](https://neon.tech/) PostgreSQL database (or another compatible PostgreSQL connection)
- A [Clerk](https://clerk.com/) application for authentication

### 1. Clone and install

```bash
git clone https://github.com/gabriel-samo/samo-finance.git
cd samo-finance
npm ci
```

### 2. Configure environment variables

Copy [`.env.example`](.env.example) to `.env.local` in the project root:

```bash
cp .env.example .env.local
```

The template contains the following variables (the keys and database URL are intentionally left blank):

```dotenv
# Clerk authentication (publishable and secret keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Clerk authentication routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# PostgreSQL / Neon connection string (server-only)
DATABASE_URL=

# Application origin for the typed Hono API client
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Fill in the values before starting the app:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for the browser (`pk_test_...` or `pk_live_...`). |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key for server-side configuration; use the same publishable key when configuring both. |
| `CLERK_SECRET_KEY` | Private Clerk secret key (`sk_test_...` or `sk_live_...`); server-side only. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route, set to `/sign-in`. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route, set to `/sign-up`. |
| `DATABASE_URL` | PostgreSQL connection string from Neon or another compatible provider (for example, `postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require`). |
| `NEXT_PUBLIC_API_URL` | Base origin of the Next.js/Hono API; use `http://localhost:3000` for local development. |

The `NEXT_PUBLIC_` prefix makes a value available to client-side code: **never put the Clerk secret key, database password, or full database URL in a `NEXT_PUBLIC_` variable.** Keep `.env.local` out of version control and configure equivalent environment variables in your hosting platform for deployment.

### 3. Apply database migrations

```bash
npm run db:migrate
```

### 4. Start the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in, create an account, and start adding transactions.

### Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Next.js lint checks |
| `npm run db:generate` | Generate Drizzle migrations after schema changes |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:studio` | Open Drizzle Studio |

> **Warning — destructive seed command:** `npm run db:seed` is intended only for an isolated development database. The current seed script deletes **all existing transactions, accounts, and categories** before inserting sample records. Do **not** run it against a production or shared database.

## Importing a CSV

1. Create an account in **Accounts**.
2. Open **Transactions → Import** and upload a `.csv` file.
3. Match the CSV columns to **`date`**, **`payee`**, and **`amount`**. Other columns can be skipped.
4. Continue and select the account for the imported transactions.

The current importer expects dates in the **`yyyy-MM-dd HH:mm:ss`** format. The application formats displayed monetary values as **USD**, and it does not perform currency conversion; check amounts and currencies before importing bank statements in other currencies.

## Project Structure

```text
app/                 Next.js pages, layouts, and Hono API routes
components/          Reusable UI, filters, charts, and data tables
features/            Accounts, categories, transactions, and summary logic
db/                  Drizzle schema and database connection
drizzle/             Database migrations
hooks/               Shared React hooks
lib/                 API client and utilities
providers/           React Query and UI providers
scripts/             Development database seed script
docs/screenshots/     Public product previews used in this README
```

## Notes

- **Public preview vs. live app:** everyone can view the screenshots on GitHub without creating an account; using the actual dashboard requires signing in.
- **Screenshot data:** the preview images use fictional values and accounts. They do not contain personal financial information.
- **Deployment:** the live instance linked above is hosted at `samo-finance.pages.dev`. Set the corresponding environment variables in your hosting environment when deploying your own copy.

---

<div align="center">

Built by [Gabriel Samoylov](https://github.com/gabriel-samo).

</div>
