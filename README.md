# ProcurePilot — AI Autonomous Commerce & Procurement

> **Next-generation autonomous procurement platform with PayPal Sandbox integration and human-in-the-loop governance.**  
> ProcurePilot empowers specialized AI agents to research suppliers, negotiate commercial agreements, and execute secure purchases within explicit spending guardrails.

---

## Highlights & Features

- **Modern Fintech / Neo-Minimalist Dashboard**: Clean white/light surfaces, dark navy/charcoal typography (`#0f172a`), PayPal blue primary actions, subtle shadows, tabular financial numbers, and interactive Recharts analytics.
- **PayPal Sandbox REST API Integration**:
  - Live OAuth 2.0 bearer token caching with automatic renewal.
  - Orders v2 API support for **Payment Authorization** and **Instant Capture**.
  - In-app live connection status checker & diagnostic testing in Settings.
  - Safe fallback for offline development.
- **Autonomous Supplier Negotiation**: AI agent haggles terms, quantity discounts, delivery speed, and warranty with suppliers in real time.
- **Policy Engine & Dual-Custody Approvals**: Enforces daily allowances, category restrictions, and multi-factor approval thresholds.
- **Proof-of-Work Verification**: Holds authorizations in trust and releases captured funds only after automated inspection verifies physical or digital deliverables.
- **Micro-Agent Fleet**:
  - *Procurement Agent*: Supplier discovery, benchmarking, and purchase execution.
  - *Negotiation Agent*: Automated commercial haggling and discount capture.
  - *Subscription Bodyguard*: Anomaly and renewal price surge detection.
  - *Cashflow Copilot*: Working capital forecasting and payment scheduling.

---

## Project Structure

Components and logic are modularized folder-wise by domain and shared capability:

```text
procurepilot-ai-commerce-claude/
├── .env.example             # Documented environment template (PayPal Sandbox & DB)
├── .env.local               # Local secrets (git-ignored)
├── .gitignore               # Strict git ignore protecting credentials & builds
├── CLAUDE.md                # Project architectural standards & development guide
├── README.md                # Project documentation
├── drizzle.config.ts        # Database ORM configuration
├── package.json
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (app)/           # Authenticated application shell
│   │   │   ├── home/        # Modern Fintech Dashboard
│   │   │   ├── procure/     # Autonomous Procurement Workflow
│   │   │   ├── agents/      # Autonomous Agent Fleet
│   │   │   ├── transactions/# Transaction Ledger & Timeline
│   │   │   ├── approvals/   # Governance & Approval Queue
│   │   │   ├── settings/    # PayPal Sandbox & Security Controls
│   │   │   └── ...
│   │   ├── api/             # API Endpoints
│   │   │   ├── paypal/      # PayPal Sandbox REST API routes (status, create, capture)
│   │   │   └── ...
│   │   ├── globals.css      # Design tokens, variables & utility classes
│   │   └── layout.tsx
│   ├── components/          # Folder-wise Component Architecture
│   │   ├── common/          # Shared foundation (Buttons, Cards, Badges, Layout, Orb)
│   │   │   ├── ui.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── orb.tsx
│   │   │   ├── hey-paypal.tsx
│   │   │   ├── commerce.tsx
│   │   │   └── index.ts
│   │   ├── dashboard/       # Dashboard feature components
│   │   │   ├── dashboard-header.tsx
│   │   │   ├── dashboard-copilot-bar.tsx
│   │   │   ├── dashboard-kpis.tsx
│   │   │   ├── dashboard-charts.tsx
│   │   │   ├── dashboard-transactions-table.tsx
│   │   │   ├── dashboard-governance.tsx
│   │   │   └── index.ts
│   │   ├── procure/         # Procurement workflow components
│   │   ├── approvals/       # Approvals board & governance
│   │   ├── payouts/         # Contractor & supplier payouts
│   │   ├── subscriptions/   # Recurring subscription monitors
│   │   ├── negotiations/    # Live negotiation transcript visualizers
│   │   ├── proof-of-work/   # Verification checklists & evidence
│   │   ├── insights/        # Historical spend & savings analytics
│   │   ├── settings/        # Settings & PayPal Sandbox diagnostics
│   │   └── index.ts         # Centralized re-exports
│   ├── db/                  # Drizzle ORM schema, client & seed
│   ├── lib/                 # Utilities, PayPal SDK, type definitions
│   │   ├── paypal.ts        # PayPal REST API Client
│   │   ├── intent.ts        # Natural language intent parser
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── utils.ts
│   └── server/              # Server-side business logic & database queries
```

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with curated Modern Fintech / Neo-minimalist design tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for subtle micro-interactions
- **Charts**: [Recharts](https://recharts.org/) for spend velocity and category breakdown
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) and [Drizzle ORM](https://orm.drizzle.team/)
- **Payments Gateway**: [PayPal REST API v2](https://developer.paypal.com/docs/api/overview/) (Sandbox Environment)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### 1. Prerequisites

- **Node.js**: v18.18 or higher (v20+ recommended)
- **npm** or **pnpm**
- A **PostgreSQL database** (e.g. Neon, Supabase, or local Postgres)
- *(Optional for live calls)*: A free **PayPal Developer Account** for sandbox testing

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd procurepilot-ai-commerce-claude
npm install
```

### 3. Environment Configuration

Copy the example environment file to `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and configure your credentials:

```bash
# PostgreSQL database connection string
DATABASE_URL="postgresql://neondb_owner:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# PayPal Sandbox Credentials
# Get your Sandbox Client ID & Secret at https://developer.paypal.com/dashboard/applications/sandbox
PAYPAL_CLIENT_ID="your_paypal_sandbox_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_sandbox_client_secret"
PAYPAL_ENVIRONMENT="sandbox"
PAYPAL_API_BASE_URL="https://api-m.sandbox.paypal.com"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_sandbox_client_id"
```

> **Note**: If `PAYPAL_CLIENT_ID` is left empty, the application will automatically run in **simulated sandbox mode** without crashing.

### 4. Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

- **Dashboard**: [http://localhost:3000/home](http://localhost:3000/home)
- **Autonomous Procurement**: [http://localhost:3000/procure](http://localhost:3000/procure)
- **PayPal Settings & Live Test**: [http://localhost:3000/settings](http://localhost:3000/settings)

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server |
| `npm run build` | Compiles the production bundle |
| `npm run start` | Starts the production server |
| `npm run typecheck` | Runs the TypeScript compiler check (`tsc --noEmit`) |
| `npm run lint` | Runs Next.js ESLint checks |

---

## PayPal Sandbox Integration Details

ProcurePilot implements a two-stage trust model for autonomous agent transactions:

```mermaid
graph LR
    A[AI Agent negotiates deal] --> B[Policy Engine checks thresholds]
    B -->|Within Limit| C[PayPal Order Created]
    B -->|Exceeds Limit| M[Manager Approval Required]
    M -->|Approved| C
    C --> D[PayPal Authorization Hold]
    D --> E[Fulfillment & Delivery]
    E --> F[AI Proof of Work Verification]
    F -->|Verified 96%| G[PayPal Capture & Release Funds]
```

1. **Authorization**: When an order is finalized, ProcurePilot creates a PayPal Order with intent `AUTHORIZE`. Funds are held in escrow.
2. **Delivery & Evidence**: Goods or services are marked in transit.
3. **Verification & Capture**: Once proof of work passes the quality checklist, ProcurePilot triggers `POST /v2/checkout/orders/{id}/capture` to finalize payment settlement.

---

## License

Private Hackathon Concept Prototype — Inspired by PayPal. Not an official PayPal product.
