# PooKanakuApp - Step-by-Step GitHub Copilot Agent Prompts

## STEP 1 - Project Architecture

Analyze the PRD and Thesis Prompt.

Design the complete project architecture for PooKanakuApp.

Requirements:

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- PostgreSQL
- Zustand

Generate:

1. Folder Structure
2. Feature Structure
3. Route Structure
4. Shared Components Structure
5. State Management Strategy
6. Database Layer Architecture
7. Service Layer Architecture
8. Authentication Flow

Do not generate implementation code.

Only generate architecture documentation.

---

## STEP 2 - Database Design

Using the approved architecture, design the complete PostgreSQL database.

Generate:

Tables:

- users(Admin)
- customers
- flower_types
- daily_supplies
- calendar_entries
- invoices
- invoice_items
- payments
- expenses
- shop_leaves

Requirements:

- Primary Keys
- Foreign Keys
- Indexes
- Constraints
- Relationships
- Audit Fields

Generate SQL migration files.

Do not generate UI.

---

## STEP 3 - Supabase Setup

Create Supabase integration.

Requirements:

- Database Connection
- Environment Variables
- Authentication Setup
- Row Level Security
- Database Client
- Server Client
- Middleware Integration

Generate only infrastructure code.

---

## STEP 4 - Authentication Module

Create Authentication System.

Features:

- Login
- Logout
- Session Management
- Route Protection

Roles:

- Admin(Owner)

Generate:

- Pages
- Components
- Middleware
- Validation

Only Authentication.

---

## STEP 5 - Application Layout

Create the application shell.

Generate:

- Sidebar
- Top Navigation
- User Profile Menu
- Theme Toggle
- Mobile Navigation
- Dashboard Layout

Do not generate business features.

---

## STEP 6 - Customer Management

Create Customer Management.

Features:

- Create Customer
- Edit Customer
- Delete Customer
- Search Customer
- Filter Customer

Customer Categories:

- Hotel
- Household
- Temple
- Shop
- Function Hall

Generate:

- Database Operations
- Server Actions
- Validation
- Forms
- Tables
- Pages

Only Customer Module.

---

## STEP 7 - Flower Types Module

Create Flower Types Management.

Features:

- Add Flower Type
- Edit Flower Type
- Delete Flower Type

Fields:

- Flower Name
- Unit
- Default Rate
- Status

Generate complete module.

---

## STEP 8 - Daily Supply Module

Create Daily Supply Management.

Features:

- Select Customer
- Select Flower Type
- Select Date
- Enter Quantity
- Enter Rate
- Notes

System should:

- Calculate Amount
- Store Records
- Update Totals

Generate complete module.

---

## STEP 9 - Calendar Verification System

Create Calendar Verification.

Status Types:

- Delivered
- Half Supply
- No Supply
- Holiday

Features:

- Monthly Calendar
- Weekly Calendar
- Customer Filter
- Status Update
- Delivery History

Use FullCalendar.

Generate complete implementation.

---

## STEP 10 - Attendance Module

Create Employee Attendance.

Features:

- Add Employee
- Mark Attendance
- Monthly Summary
- Employee History

Statuses:

- Present
- Absent
- Half Day
- Leave

Generate complete module.

---

## STEP 11 - Billing Engine

Create Billing System.

Rules:

- Use Calendar Verification Records
- Use Daily Supply Records
- Ignore No Supply Days
- Handle Half Supply Days

Generate:

- Invoice Generation Service
- Invoice Storage
- Invoice UI
- Billing Dashboard

Generate complete module.

---

## STEP 12 - PDF Invoice Generator

Create PDF Invoice System.

Features:

- Professional Invoice Design
- Customer Details
- Flower Details
- Delivery Summary
- Payment Summary

Generate downloadable PDF.

---

## STEP 13 - Payment Management

Create Payment Tracking.

Features:

- Record Payment
- Payment History
- Outstanding Amount
- Partial Payment
- Full Payment

Methods:

- Cash
- UPI
- Bank Transfer
- Cheque

No payment gateway integration.

Generate complete module.

---

## STEP 14 - Expense Management

Create Expense Tracking.

Categories:

- Flower Purchase
- Transportation
- Salary
- Electricity
- Packaging
- Miscellaneous

Generate complete module.

---

## STEP 15 - Dashboard

Create Dashboard.

Widgets:

- Revenue Today
- Revenue This Month
- Outstanding Amount
- Total Customers
- Total Expenses
- Net Profit

Generate dashboard only.

---

## STEP 16 - Reports

Create Reporting Module.

Reports:

- Revenue
- Expenses
- Profit
- Customers
- Attendance
- Outstanding Payments

Generate charts using Recharts.

---

## STEP 17 - Mobile Optimization

Optimize entire application for:

- Mobile
- Tablet
- Desktop

Generate responsive improvements only.

---

## STEP 18 - Testing

Generate:

- Unit Tests
- Integration Tests
- Validation Tests
- Error Handling Tests

Cover all modules.

---

## STEP 19 - Production Readiness

Review entire application.

Check:

- Security
- Performance
- Scalability
- Accessibility
- Type Safety
- Database Optimization

Generate recommendations and fixes.

---

## STEP 20 - Deployment

Generate deployment setup.

Requirements:

- Vercel Deployment
- Supabase Production Setup
- Environment Variables
- Build Configuration
- Backup Strategy

Generate deployment documentation.
