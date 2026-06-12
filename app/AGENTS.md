# PooKanakuApp - Project Continuation & Recovery Prompt

You are taking over development of an existing project called PooKanakuApp.

Before writing or modifying any code, perform a complete project audit.

## Project Overview

PooKanakuApp is a flower business management PWA built for a family-owned flower shop.

Technology Stack:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- PWA Support
- Server Actions
- Responsive Design

## Primary Goal

Manage:

- Customers
- Daily Flower Supply
- Calendar Verification
- Billing & Invoices
- Payments
- Expenses
- Shop Leave Management
- Reports & Analytics

This is NOT an employee attendance system.

## Important Business Rule

The old Employee Attendance module has been removed.

Replace all attendance-related logic with Shop Leave Management.

Shop Leave means:

- Shop closed
- Festival holiday
- Transport issue
- Stock unavailable
- Emergency closure
- Half day supply

No employee tracking should exist.

## Current Shop Leave Schema

```sql
CREATE TABLE shop_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leave_date DATE NOT NULL,
    leave_type VARCHAR(50) NOT NULL CHECK (
        leave_type IN (
            'Full Leave',
            'Half Day',
            'Festival Holiday',
            'Stock Unavailable',
            'Transport Issue',
            'Emergency Closure',
            'Custom'
        )
    ),
    reason VARCHAR(255),
    custom_description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(leave_date, leave_type)
);
```

## Audit Tasks

1. Analyze entire project structure.
2. Read all PRD documents.
3. Read all prompt files.
4. Compare implementation vs PRD.
5. Detect missing modules.
6. Detect broken pages.
7. Detect build errors.
8. Detect TypeScript errors.
9. Detect database schema mismatches.
10. Detect unused components and dead code.

## Fix Priority Order

### Phase 1 - Stabilize

- Fix build errors
- Fix runtime errors
- Fix loading loops
- Fix broken imports
- Fix duplicate components
- Fix hydration issues
- Fix Supabase errors

### Phase 2 - Core Business Modules

Verify and complete:

- Dashboard
- Customers
- Flower Types
- Daily Supplies
- Calendar
- Billing
- Payments
- Expenses
- Shop Leave Management
- Reports

### Phase 3 - Calendar Module

Expected UX:

- Month View
- Customer Verification
- Supply Tracking
- Leave Visualization
- Status Colors

Status Types:

- Delivered
- Half Supply
- No Supply
- Holiday
- Shop Leave

### Phase 4 - Billing Module

Generate invoices automatically from:

- Daily supplies
- Calendar verification
- Shop leave adjustments

Support:

- PDF invoice
- Print invoice
- Outstanding tracking
- Payment history

### Phase 5 - Dashboard

Show:

- Monthly Revenue
- Outstanding Amount
- Total Customers
- Daily Supplies
- Shop Leave Count
- Recent Payments

## UI/UX Requirements

Design Quality:

- Professional SaaS
- Zoho Books inspired
- Mobile-first
- Responsive
- Accessible

Color Theme:

Primary:
#2E7D32

Secondary:
#F8BBD0

Accent:
#FFD54F

Background:
#FAFAFA

Cards:
#FFFFFF

Use:

- Consistent spacing
- Modern typography
- Clean navigation
- Sidebar + Topbar layout

## Development Rules

Before modifying any file:

1. Explain the issue.
2. Explain root cause.
3. Explain proposed fix.
4. Then implement.

After every completed task:

- Run lint
- Run type check
- Run build
- Verify route works

## Git Workflow

After every successful feature or bug fix:

1. Create git commit.
2. Use meaningful commit message.
3. Summarize changed files.
4. Summarize completed functionality.

Never leave uncommitted changes.

## Output Format

For every session:

1. Project Audit Summary
2. Issues Found
3. Fix Plan
4. Files To Modify
5. Implementation
6. Validation Results
7. Git Commit Message

Start by auditing the project before writing any code.
