# PooKanakuApp - Product Requirements Document

## Product Name

PooKanakuApp

## Product Type

Web Application

## Product Vision

PooKanakuApp is a business management platform designed for flower suppliers who deliver flowers daily to hotels, households, temples, shops, and commercial customers.

The application digitizes daily delivery records, attendance tracking, billing, payment management, expense management, and reporting while replacing traditional notebook-based bookkeeping.

The primary objective is to simplify daily operations and generate accurate monthly invoices based on verified delivery records.

---

# Problem Statement

Most flower shop owners maintain records using notebooks, WhatsApp messages, and manual calculations.

This causes:

* Missing payment records
* Incorrect billing calculations
* Difficulty tracking outstanding balances
* Lack of customer history
* No centralized reporting system
* Time-consuming month-end invoice generation

The application should solve these problems through a centralized web-based platform.

---

# Target Users

## Primary User

Flower Shop Owner

Responsibilities:

* Manage customers
* Record deliveries
* Track payments
* Generate invoices
* Monitor business performance

## Secondary User

Staff Member

Responsibilities:

* Record daily flower deliveries
* Update attendance
* Verify delivery status

---

# Core Business Workflow

Customer Registration

↓

Daily Flower Supply Entry

↓

Calendar Verification

↓

Monthly Billing Calculation

↓

Invoice Generation

↓

Payment Collection

↓

Expense Tracking

↓

Business Reports

---

# Core Modules

## Authentication

Features:

* Login
* Logout
* Session Management
* Role-Based Access

Roles:

* Admin
* Staff

---

## Customer Management

Customer Categories:

* Hotel
* Household
* Temple
* Shop
* Function Hall

Customer Information:

* Name
* Phone Number
* Address
* Category
* Daily Requirement
* Flower Preferences
* Notes

Functions:

* Create Customer
* Edit Customer
* Delete Customer
* Search Customer
* Filter Customer

---

## Daily Supply Management

Purpose:

Track daily flower deliveries.

Data Captured:

* Customer
* Date
* Flower Type
* Quantity
* Unit Rate
* Remarks

System Calculations:

Quantity × Rate

Daily totals

Monthly totals

---

## Calendar Verification System

Purpose:

Act as the primary verification source for billing.

Statuses:

* Delivered
* Half Supply
* No Supply
* Holiday

Features:

* Monthly View
* Customer View
* Status Updates
* Delivery History

All invoices must be generated using verified calendar records.

---

## Billing System

Purpose:

Generate accurate invoices.

Invoice Contents:

* Customer Name
* Billing Month
* Delivery Days
* Flower Quantities
* Total Amount
* Paid Amount
* Outstanding Amount

Functions:

* Generate Invoice
* View Invoice
* Download PDF
* Share Invoice

---

## Payment Management

Purpose:

Track customer payments.

Features:

* Manual Payment Entry
* Payment History
* Outstanding Balance Tracking
* Partial Payment Support

Payment Methods:

* Cash
* UPI
* Bank Transfer
* Cheque

No third-party payment integration.

---

## Expense Management

Expense Categories:

* Flower Purchase
* Transportation
* Employee Salary
* Electricity
* Packaging
* Miscellaneous

Features:

* Expense Recording
* Monthly Expense Tracking
* Expense Reports

---

## Leave Taken Management

Purpose:

Track days when the shop is closed or on leave.

Statuses:

* Present
* Absent
* Half Day
* Leave

Features:

* Mark Leave
* Monthly Summary
* Leave History

---

## Dashboard

Display:

* Today's Revenue
* Monthly Revenue
* Outstanding Payments
* Total Customers
* Total Expenses
* Net Profit

---

## Reporting System

Reports:

* Revenue Report
* Expense Report
* Profit Report
* Customer Report
* Leave Report
* Outstanding Payment Report

Features:

* Date Filters
* Export Options
* Charts and Analytics

---

# Non-Functional Requirements

Performance:

* Page load under 2 seconds

Scalability:

* Support 500+ customers

Security:

* Role-based access control

Reliability:

* Daily backups

Responsiveness:

* Desktop
* Tablet
* Mobile

Localization:

* English
* Tamil

---

# Technology Stack

Frontend:

* Next.js 15
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend:

* Supabase

Database:

* PostgreSQL

Authentication:

* Supabase Auth

State Management:

* Zustand

Calendar:

* FullCalendar

Charts:

* Recharts

PDF Generation:

* pdf-lib

Hosting:

* Vercel

---

# Success Metrics

* Reduce manual bookkeeping by 90%
* Generate monthly invoices automatically
* Eliminate billing calculation errors
* Improve payment tracking accuracy
* Provide complete business visibility
