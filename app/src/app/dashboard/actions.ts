'use server';

import { supabaseServer } from '../../lib/supabaseServer';

export interface DashboardStats {
  todayRevenue: number;
  monthlyRevenue: number;
  outstandingAmount: number;
  totalCustomers: number;
  monthlyExpenses: number;
  netProfit: number;
  recentPayments: {
    id: string;
    amount: number;
    payment_date: string;
    payment_method: string | null;
    customers: { name: string } | null;
  }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const sb = supabaseServer();

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

  // Run all queries in parallel
  const [
    todaySupplyResult,
    monthlySupplyResult,
    outstandingResult,
    customerCountResult,
    monthlyExpenseResult,
    recentPaymentsResult,
  ] = await Promise.all([
    // Today's revenue from daily supplies
    sb.from('daily_supplies')
      .select('total_amount')
      .eq('supply_date', today),

    // Monthly revenue from daily supplies
    sb.from('daily_supplies')
      .select('total_amount')
      .gte('supply_date', monthStart)
      .lte('supply_date', monthEnd),

    // Outstanding amount from unpaid/partially paid invoices
    sb.from('invoices')
      .select('outstanding_amount')
      .in('status', ['Unpaid', 'Partially Paid']),

    // Total customers
    sb.from('customers')
      .select('id', { count: 'exact', head: true }),

    // Monthly expenses
    sb.from('expenses')
      .select('amount')
      .gte('expense_date', monthStart)
      .lte('expense_date', monthEnd),

    // Recent payments (last 5)
    sb.from('payments')
      .select('id, amount, payment_date, payment_method, customers(name)')
      .order('payment_date', { ascending: false })
      .limit(5),
  ]);

  const todayRevenue = (todaySupplyResult.data || []).reduce((sum, r) => sum + (r.total_amount || 0), 0);
  const monthlyRevenue = (monthlySupplyResult.data || []).reduce((sum, r) => sum + (r.total_amount || 0), 0);
  const outstandingAmount = (outstandingResult.data || []).reduce((sum, r) => sum + (r.outstanding_amount || 0), 0);
  const totalCustomers = customerCountResult.count || 0;
  const monthlyExpenses = (monthlyExpenseResult.data || []).reduce((sum, r) => sum + (r.amount || 0), 0);
  const netProfit = monthlyRevenue - monthlyExpenses;

  return {
    todayRevenue,
    monthlyRevenue,
    outstandingAmount,
    totalCustomers,
    monthlyExpenses,
    netProfit,
    recentPayments: (recentPaymentsResult.data || []).map((p: any) => ({
      id: p.id,
      amount: p.amount,
      payment_date: p.payment_date,
      payment_method: p.payment_method,
      customers: Array.isArray(p.customers) ? p.customers[0] : p.customers,
    })),
  };
}
