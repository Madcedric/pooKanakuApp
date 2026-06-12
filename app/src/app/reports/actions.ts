'use server';

import { supabaseServer } from '../../lib/supabaseServer';

// ============================================
// Revenue Report
// ============================================
export interface DailyRevenue {
  date: string;
  amount: number;
}

export interface MonthlyRevenueSummary {
  month: string;
  totalRevenue: number;
  dailyData: DailyRevenue[];
}

export async function getRevenueReport(months: number = 6): Promise<MonthlyRevenueSummary[]> {
  const sb = supabaseServer();
  const results: MonthlyRevenueSummary[] = [];

  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const mon = d.getMonth() + 1;
    const monthStr = `${year}-${String(mon).padStart(2, '0')}`;
    const lastDay = new Date(year, mon, 0).getDate();
    const start = `${monthStr}-01`;
    const end = `${monthStr}-${String(lastDay).padStart(2, '0')}`;

    const { data } = await sb
      .from('daily_supplies')
      .select('supply_date, total_amount')
      .gte('supply_date', start)
      .lte('supply_date', end)
      .order('supply_date');

    const dailyMap = new Map<string, number>();
    (data || []).forEach(r => {
      const current = dailyMap.get(r.supply_date) || 0;
      dailyMap.set(r.supply_date, current + (r.total_amount || 0));
    });

    const dailyData: DailyRevenue[] = Array.from(dailyMap.entries()).map(([date, amount]) => ({ date, amount }));
    const totalRevenue = dailyData.reduce((sum, d) => sum + d.amount, 0);

    results.push({
      month: d.toLocaleDateString('default', { month: 'short', year: 'numeric' }),
      totalRevenue,
      dailyData,
    });
  }

  return results;
}

// ============================================
// Expense Report
// ============================================
export interface CategoryExpense {
  category: string;
  amount: number;
}

export interface MonthlyExpenseSummary {
  month: string;
  totalExpenses: number;
  byCategory: CategoryExpense[];
}

export async function getExpenseReport(months: number = 6): Promise<MonthlyExpenseSummary[]> {
  const sb = supabaseServer();
  const results: MonthlyExpenseSummary[] = [];

  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const mon = d.getMonth() + 1;
    const monthStr = `${year}-${String(mon).padStart(2, '0')}`;
    const lastDay = new Date(year, mon, 0).getDate();
    const start = `${monthStr}-01`;
    const end = `${monthStr}-${String(lastDay).padStart(2, '0')}`;

    const { data } = await sb
      .from('expenses')
      .select('category, amount')
      .gte('expense_date', start)
      .lte('expense_date', end);

    const catMap = new Map<string, number>();
    (data || []).forEach(r => {
      const cat = r.category || 'Miscellaneous';
      catMap.set(cat, (catMap.get(cat) || 0) + (r.amount || 0));
    });

    const byCategory: CategoryExpense[] = Array.from(catMap.entries()).map(([category, amount]) => ({ category, amount }));
    const totalExpenses = byCategory.reduce((sum, c) => sum + c.amount, 0);

    results.push({
      month: d.toLocaleDateString('default', { month: 'short', year: 'numeric' }),
      totalExpenses,
      byCategory,
    });
  }

  return results;
}

// ============================================
// Profit Report
// ============================================
export interface MonthlyProfit {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export async function getProfitReport(months: number = 6): Promise<MonthlyProfit[]> {
  const [revenueData, expenseData] = await Promise.all([
    getRevenueReport(months),
    getExpenseReport(months),
  ]);

  return revenueData.map((r, i) => ({
    month: r.month,
    revenue: r.totalRevenue,
    expenses: expenseData[i]?.totalExpenses || 0,
    profit: r.totalRevenue - (expenseData[i]?.totalExpenses || 0),
  }));
}

// ============================================
// Customer Report
// ============================================
export interface CustomerRevenue {
  customerId: string;
  customerName: string;
  totalRevenue: number;
  totalSupplyDays: number;
  category: string | null;
}

export async function getCustomerReport(month?: string): Promise<CustomerRevenue[]> {
  const sb = supabaseServer();

  let query = sb
    .from('daily_supplies')
    .select('customer_id, total_amount, supply_date, customers(id, name, category)');

  if (month) {
    const [year, mon] = month.split('-').map(Number);
    const lastDay = new Date(year, mon, 0).getDate();
    query = query
      .gte('supply_date', `${month}-01`)
      .lte('supply_date', `${month}-${String(lastDay).padStart(2, '0')}`);
  }

  const { data } = await query;

  const customerMap = new Map<string, { name: string; category: string | null; revenue: number; days: number }>();
  (data || []).forEach(r => {
    const id = r.customer_id;
    const existing = customerMap.get(id);
    if (existing) {
      existing.revenue += r.total_amount || 0;
      existing.days += 1;
    } else {
      customerMap.set(id, {
        name: (r.customers as any)?.name || 'Unknown',
        category: (r.customers as any)?.category || null,
        revenue: r.total_amount || 0,
        days: 1,
      });
    }
  });

  return Array.from(customerMap.entries())
    .map(([customerId, data]) => ({
      customerId,
      customerName: data.name,
      totalRevenue: data.revenue,
      totalSupplyDays: data.days,
      category: data.category,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
}

// ============================================
// Outstanding Report
// ============================================
export interface OutstandingInvoice {
  invoiceId: string;
  customerName: string;
  billingMonth: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: string;
  daysOverdue: number;
}

export async function getOutstandingReport(): Promise<OutstandingInvoice[]> {
  const sb = supabaseServer();
  const { data } = await sb
    .from('invoices')
    .select(`
      id, billing_month, total_amount, paid_amount, outstanding_amount, status, created_at,
      customers ( name )
    `)
    .in('status', ['Unpaid', 'Partially Paid'])
    .order('billing_month', { ascending: true });

  const now = new Date();
  return (data || []).map(inv => {
    const createdAt = new Date(inv.created_at);
    const daysOverdue = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    return {
      invoiceId: inv.id,
      customerName: (inv.customers as any)?.name || 'Unknown',
      billingMonth: new Date(inv.billing_month).toLocaleDateString('default', { month: 'long', year: 'numeric' }),
      totalAmount: inv.total_amount,
      paidAmount: inv.paid_amount,
      outstandingAmount: inv.outstanding_amount,
      status: inv.status,
      daysOverdue,
    };
  });
}
