// src/types/database.ts
// TypeScript types for all Supabase database tables

// ============================================
// Row types (what Supabase returns from queries)
// ============================================

export interface Customer {
  id: string;
  name: string;
  phone_number: string | null;
  address: string | null;
  category: 'Hotel' | 'Household' | 'Temple' | 'Shop' | 'Function Hall' | null;
  daily_requirement: string | null;
  flower_preferences: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FlowerType {
  id: string;
  name: string;
  unit: string;
  default_rate: number;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface DailySupply {
  id: string;
  customer_id: string;
  flower_type_id: string;
  supply_date: string;
  quantity: number;
  unit_rate: number;
  total_amount: number; // generated column
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarEntry {
  id: string;
  customer_id: string;
  entry_date: string;
  status: 'Delivered' | 'Half Supply' | 'No Supply' | 'Holiday';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  customer_id: string;
  billing_month: string; // stored as first day of month
  total_amount: number;
  paid_amount: number;
  outstanding_amount: number; // generated column
  status: 'Unpaid' | 'Partially Paid' | 'Paid';
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  flower_type_id: string;
  total_quantity: number;
  average_rate: number;
  item_total: number;
  created_at: string;
}

export interface Payment {
  id: string;
  customer_id: string;
  invoice_id: string | null;
  amount: number;
  payment_date: string;
  payment_method: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | null;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  category: 'Flower Purchase' | 'Transportation' | 'Salary' | 'Electricity' | 'Packaging' | 'Miscellaneous' | null;
  amount: number;
  expense_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShopLeave {
  id: string;
  leave_date: string;
  leave_type:
    | 'Full Leave'
    | 'Half Day'
    | 'Festival Holiday'
    | 'Stock Unavailable'
    | 'Transport Issue'
    | 'Emergency Closure'
    | 'Custom';
  reason: string | null;
  custom_description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  auth_uid: string | null;
  email: string;
  full_name: string | null;
  role: 'Admin';
  is_super: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// Insert types (what we send to Supabase for creation)
// Omits auto-generated fields: id, created_at, updated_at
// ============================================

export type CustomerInsert = Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
export type FlowerTypeInsert = Omit<FlowerType, 'id' | 'created_at' | 'updated_at'>;
export type DailySupplyInsert = Omit<DailySupply, 'id' | 'created_at' | 'updated_at' | 'total_amount'>;
export type CalendarEntryInsert = Omit<CalendarEntry, 'id' | 'created_at' | 'updated_at'>;
export type InvoiceInsert = Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'outstanding_amount'>;
export type InvoiceItemInsert = Omit<InvoiceItem, 'id' | 'created_at'>;
export type PaymentInsert = Omit<Payment, 'id' | 'created_at'>;
export type ExpenseInsert = Omit<Expense, 'id' | 'created_at' | 'updated_at'>;
export type ShopLeaveInsert = Omit<ShopLeave, 'id' | 'created_at' | 'updated_at'>;
export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;

// ============================================
// Update types (partial versions for updates)
// ============================================

export type CustomerUpdate = Partial<CustomerInsert>;
export type FlowerTypeUpdate = Partial<FlowerTypeInsert>;
export type DailySupplyUpdate = Partial<Omit<DailySupply, 'id' | 'created_at' | 'updated_at' | 'total_amount'>>;
export type CalendarEntryUpdate = Partial<Pick<CalendarEntry, 'status' | 'notes'>>;
export type InvoiceUpdate = Partial<Pick<Invoice, 'paid_amount' | 'status'>>;
export type PaymentUpdate = Partial<Omit<Payment, 'id' | 'created_at'>>;
export type ExpenseUpdate = Partial<ExpenseInsert>;
export type ShopLeaveUpdate = Partial<ShopLeaveInsert>;

// ============================================
// Query result types (with joined relations)
// ============================================

export interface DailySupplyWithRelations extends DailySupply {
  customers: Pick<Customer, 'id' | 'name'> | null;
  flower_types: Pick<FlowerType, 'id' | 'name' | 'unit'> | null;
}

export interface InvoiceWithCustomer extends Invoice {
  customers: Pick<Customer, 'id' | 'name'> | null;
}

export interface InvoiceWithItems extends Invoice {
  customers: Pick<Customer, 'id' | 'name' | 'phone_number' | 'address'> | null;
  invoice_items: (InvoiceItem & {
    flower_types: Pick<FlowerType, 'name' | 'unit'> | null;
  })[];
}

export interface PaymentWithRelations extends Payment {
  customers: Pick<Customer, 'id' | 'name'> | null;
  invoices: Pick<Invoice, 'id' | 'billing_month'> | null;
}

// ============================================
// API response types
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Leave report types
// ============================================

export interface LeaveReportRow {
  leave_date: string;
  leave_type: string | null;
  reason: string | null;
  custom_description: string | null;
  notes: string | null;
}

export interface LeaveReport {
  month: string;
  total: number;
  breakdown: Record<string, number>;
  rows: LeaveReportRow[];
}

// ============================================
// Dashboard stats types
// ============================================

export interface DashboardStats {
  todayRevenue: number;
  monthlyRevenue: number;
  outstandingAmount: number;
  totalCustomers: number;
  monthlyExpenses: number;
  netProfit: number;
}
