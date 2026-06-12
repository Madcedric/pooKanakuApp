# PooKanakuApp — Architecture Document (STEP 1)

This document captures the high-level architecture for PooKanakuApp based on `PRD.md` and `prompts.md`.

## Technology Stack

- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- State: Zustand
- Backend: Supabase (Postgres + Auth + Storage)
- Calendar: FullCalendar
- Charts: Recharts
- PDF: pdf-lib
- Hosting: Vercel

## Folder Structure (recommended)

src/
app/ # Next.js App Router
layout.tsx
page.tsx # Public landing / login
(auth)/ # auth routes (login, logout, callbacks)
dashboard/ # protected dashboard root
customers/ # customers feature routes
flowers/ # flower types feature
supplies/ # daily supply entries
calendar/ # calendar verification UI
attendance/ # employee attendance
billing/ # invoice generation & viewing
payments/ # payment records
expenses/ # expense management
reports/ # reporting pages
components/ # shared UI components
AppShell.tsx
Sidebar.tsx
TopNav.tsx
ThemeToggle.tsx
forms/ # reusable form controls
tables/ # table components
calendar/ # FullCalendar wrappers
lib/
supabase.ts # client & server supabase helpers
validators.ts # zod schemas / validation helpers
services/ # business logic and data access
customers.ts
flowers.ts
supplies.ts
calendar.ts
billing.ts # invoice generation rules
payments.ts
expenses.ts
pdf.ts # invoice PDF generator wrapper
stores/ # Zustand stores
authStore.ts
uiStore.ts
customersStore.ts
suppliesStore.ts
types/ # shared TypeScript types
hooks/ # custom React hooks
utils/ # helpers, formatters

tests/
unit/
integration/

scripts/
migrate/ # SQL migrations

## Feature Structure

- Each feature directory (e.g., `customers`) contains:
  - route files for App Router (`page.tsx`, `layout.tsx`, `actions.ts`)
  - server actions for writes where appropriate
  - components for forms and lists
  - service module in `services/` for business rules

## Route Structure (high level)

- `/login` — Login flow (Supabase)
- `/dashboard` — Overview widgets
- `/customers` — List, Create, Edit
- `/flowers` — Flower types CRUD
- `/supplies` — Daily supply entry UI
- `/calendar` — Verification calendar (FullCalendar)
- `/attendance` — Employee attendance
- `/billing` — Invoice generation + list
- `/billing/[invoiceId]` — Invoice view + download PDF
- `/payments` — Record payments
- `/expenses` — Manage expenses
- `/reports` — Charts and exports

## Shared Components

- `AppShell` — layout wrapper with `Sidebar` and `TopNav`
- `Sidebar` — navigation links and user quick actions
- `TopNav` — user profile menu, search, quick actions
- `ThemeToggle` — dark/light toggle (persisted in `uiStore`)
- `Form` primitives — inputs, selects, date pickers, validators
- `Table` primitives — sortable, paginated tables
- `Modal` and `Toast` components for confirmations and feedback

## State Management Strategy (Zustand)

- Use small, focused stores per domain to avoid large global state:
  - `authStore` — current user, roles, session state
  - `uiStore` — theme, sidebar state, toasts
  - `customersStore` — cached customer lists, filters
  - `suppliesStore` — daily supply drafts, totals
  - `calendarStore` — calendar view state and filters
  - `billingStore` — invoice drafts and generation status
- Keep server-of-truth in Supabase; use stores as client cache and optimistic UI.

## Data Access / Database Layer

- Centralize DB access through `lib/supabase.ts` and `services/*` modules.
- Use Supabase server client in server components/server actions for secure writes.
- Use typed rows (TS interfaces) and Zod validators on inputs.
- Prefer single-purpose queries with proper indexes and pagination.

Planned tables (high level): `users`, `customers`, `flower_types`, `daily_supplies`, `calendar_entries`, `invoices`, `invoice_items`, `payments`, `expenses`, `shop_leaves`.

Audit fields: `id` (uuid), `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at` (soft delete optional).

## Service Layer Architecture

- `services/*` modules encapsulate business logic and DB queries.
  - input validation (zod) → permission checks → DB query → domain calculations → return typed result
- `billing.ts` contains invoice generation logic:
  - reads verified `calendar_entries` + `daily_supplies`
  - applies rules for half-supply/no-supply
  - aggregates quantities and generates `invoice` + `invoice_items`
  - persists invoice and returns PDF via `pdf.ts`
- `pdf.ts` wraps `pdf-lib` to produce downloadable invoices using a template.

## Authentication Flow

- Use Supabase Auth for user sign-in (email/OTP or email/password per setup).
- Persist session on server via Supabase session cookies (or JWT if preferred).
- Middleware (Next App Router `middleware.ts`) intercepts protected routes and:
  - verifies session server-side
  - enforces role-based access (Admin vs Staff)
  - redirects to `/login` if unauthenticated or unauthorized
- `authStore` subscribes to Supabase auth changes on the client for UI updates.

## Server / Client Component Guidelines

- Use Server Components for pages that primarily render data (faster SSR).
- Use Client Components for interactive pieces (forms, calendar interactions, modals).
- Use Next.js server actions for safe server-side mutations where appropriate.

## RLS and Security

- Configure Row Level Security (RLS) policies in Supabase; keep server-side operations under a service role where needed.
- Apply principle of least privilege: users only access customer data tied to their shop.

## Testing Strategy

- Unit tests for services and utils (Jest / Vitest)
- Integration tests for key flows (auth, invoice generation)
- End-to-end spot-checks (Playwright) for critical user journeys

## Environment & Deployment Notes

- Keep secrets in environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `NEXT_PUBLIC_*` where appropriate.
- Use Vercel for deployment; configure environment variables in project settings and set up CI for migrations.

---

Next steps: produce SQL migrations for the database schema (STEP 2) and Supabase setup (STEP 3).
