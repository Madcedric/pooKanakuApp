'use server';

import { supabaseServer } from '../../lib/supabaseServer';
import { revalidatePath } from 'next/cache';

/**
 * Generate invoices for all customers (or a specific customer) for a given month.
 *
 * Billing rules:
 * - Uses daily_supplies records for the month
 * - Uses calendar_entries to adjust amounts:
 *   - "No Supply" days: quantity set to 0
 *   - "Half Supply" days: quantity halved
 *   - "Delivered" (or no entry): full quantity
 *   - "Holiday": quantity set to 0
 * - Groups by flower_type to create invoice_items
 * - Creates invoice with total = sum of item totals
 */
export async function generateInvoices(month: string, customerId?: string) {
  // month format: YYYY-MM
  const sb = supabaseServer();
  const [year, mon] = month.split('-').map(Number);
  const monthStart = `${month}-01`;
  const lastDay = new Date(year, mon, 0).getDate();
  const monthEnd = `${month}-${String(lastDay).padStart(2, '0')}`;

  // 1. Get customers to bill
  let customers;
  if (customerId) {
    const { data } = await sb.from('customers').select('id, name').eq('id', customerId).single();
    customers = data ? [data] : [];
  } else {
    const { data } = await sb.from('customers').select('id, name').order('name');
    customers = data || [];
  }

  const results: { customerId: string; customerName: string; invoiceId: string | null; totalAmount: number; skipped: boolean }[] = [];

  for (const customer of customers) {
    // 2. Get daily supplies for this customer in the month
    const { data: supplies } = await sb
      .from('daily_supplies')
      .select('id, flower_type_id, supply_date, quantity, unit_rate')
      .eq('customer_id', customer.id)
      .gte('supply_date', monthStart)
      .lte('supply_date', monthEnd);

    if (!supplies || supplies.length === 0) {
      results.push({ customerId: customer.id, customerName: customer.name, invoiceId: null, totalAmount: 0, skipped: true });
      continue;
    }

    // 3. Get calendar entries for this customer in the month
    const { data: calendarEntries } = await sb
      .from('calendar_entries')
      .select('entry_date, status')
      .eq('customer_id', customer.id)
      .gte('entry_date', monthStart)
      .lte('entry_date', monthEnd);

    // Build a lookup: date → status
    const calendarMap = new Map<string, string>();
    (calendarEntries || []).forEach(e => calendarMap.set(e.entry_date, e.status));

    // 4. Get shop leaves for the month (affects all customers)
    const { data: shopLeaves } = await sb
      .from('shop_leaves')
      .select('leave_date, leave_type')
      .gte('leave_date', monthStart)
      .lte('leave_date', monthEnd);

    const leaveMap = new Map<string, string>();
    (shopLeaves || []).forEach(l => leaveMap.set(l.leave_date, l.leave_type));

    // 5. Check if invoice already exists for this customer/month
    const { data: existingInvoice } = await sb
      .from('invoices')
      .select('id')
      .eq('customer_id', customer.id)
      .eq('billing_month', monthStart)
      .maybeSingle();

    // 6. Apply adjustments to quantities
    const adjustedSupplies = supplies.map(supply => {
      const dateStr = supply.supply_date;
      const calendarStatus = calendarMap.get(dateStr);
      const leaveType = leaveMap.get(dateStr);

      // Shop leave overrides everything
      if (leaveType === 'Full Leave' || leaveType === 'Festival Holiday' || leaveType === 'Emergency Closure') {
        return { ...supply, adjustedQuantity: 0 };
      }

      // Half Day leave or Half Supply calendar
      if (leaveType === 'Half Day' || calendarStatus === 'Half Supply') {
        return { ...supply, adjustedQuantity: supply.quantity * 0.5 };
      }

      // No Supply or Holiday
      if (calendarStatus === 'No Supply' || calendarStatus === 'Holiday') {
        return { ...supply, adjustedQuantity: 0 };
      }

      // Default: full delivery
      return { ...supply, adjustedQuantity: supply.quantity };
    });

    // 7. Group by flower_type
    const flowerGroups = new Map<string, { totalQuantity: number; totalAmount: number; rate: number }>();
    for (const s of adjustedSupplies) {
      const existing = flowerGroups.get(s.flower_type_id);
      if (existing) {
        existing.totalQuantity += s.adjustedQuantity;
        existing.totalAmount += s.adjustedQuantity * s.unit_rate;
      } else {
        flowerGroups.set(s.flower_type_id, {
          totalQuantity: s.adjustedQuantity,
          totalAmount: s.adjustedQuantity * s.unit_rate,
          rate: s.unit_rate,
        });
      }
    }

    const totalAmount = Array.from(flowerGroups.values()).reduce((sum, g) => sum + g.totalAmount, 0);

    if (totalAmount === 0) {
      results.push({ customerId: customer.id, customerName: customer.name, invoiceId: null, totalAmount: 0, skipped: true });
      continue;
    }

    // 8. Upsert invoice
    let invoiceId: string;
    if (existingInvoice) {
      invoiceId = existingInvoice.id;
      await sb.from('invoices').update({ total_amount: totalAmount }).eq('id', invoiceId);
      // Delete old items
      await sb.from('invoice_items').delete().eq('invoice_id', invoiceId);
    } else {
      const { data: newInvoice } = await sb.from('invoices').insert({
        customer_id: customer.id,
        billing_month: monthStart,
        total_amount: totalAmount,
        paid_amount: 0,
        status: 'Unpaid',
      }).select('id').single();
      invoiceId = newInvoice!.id;
    }

    // 9. Insert invoice items
    const items = Array.from(flowerGroups.entries()).map(([flowerTypeId, group]) => ({
      invoice_id: invoiceId,
      flower_type_id: flowerTypeId,
      total_quantity: group.totalQuantity,
      average_rate: group.rate,
      item_total: group.totalAmount,
    }));

    await sb.from('invoice_items').insert(items);

    results.push({ customerId: customer.id, customerName: customer.name, invoiceId, totalAmount, skipped: false });
  }

  revalidatePath('/billing');
  revalidatePath('/');
  return results;
}

export async function getInvoices() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('invoices')
    .select(`
      *,
      customers ( id, name ),
      invoice_items ( *, flower_types ( name, unit ) )
    `)
    .order('billing_month', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
  return data;
}

export async function getInvoiceById(invoiceId: string) {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('invoices')
    .select(`
      *,
      customers ( id, name, phone_number, address ),
      invoice_items ( *, flower_types ( name, unit ) )
    `)
    .eq('id', invoiceId)
    .single();

  if (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
  return data;
}

export async function deleteInvoice(invoiceId: string) {
  const sb = supabaseServer();
  const { error } = await sb.from('invoices').delete().eq('id', invoiceId);

  if (error) {
    console.error('Error deleting invoice:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/billing');
  revalidatePath('/');
  return { success: true };
}

/**
 * Generate a PDF for the given invoice and return it as a base64 string.
 */
export async function getInvoicePDF(invoiceId: string): Promise<string | null> {
  const { generateInvoicePDF } = await import('../../lib/pdf');

  const sb = supabaseServer();

  // Fetch invoice with customer and items
  const { data: invoice, error: invErr } = await sb
    .from('invoices')
    .select(`
      *,
      customers ( name, phone_number, address ),
      invoice_items ( *, flower_types ( name, unit ) )
    `)
    .eq('id', invoiceId)
    .single();

  if (invErr || !invoice) return null;

  const items = (invoice.invoice_items || []).map((item: any) => ({
    flower_name: item.flower_types?.name || '-',
    unit: item.flower_types?.unit || '-',
    quantity: item.total_quantity,
    rate: item.average_rate,
    total: item.item_total,
  }));

  const pdfBytes = await generateInvoicePDF({
    invoice: {
      id: invoice.id,
      billing_month: invoice.billing_month,
      total_amount: invoice.total_amount,
      paid_amount: invoice.paid_amount,
      outstanding_amount: invoice.outstanding_amount,
      status: invoice.status,
      created_at: invoice.created_at,
    },
    customer: {
      name: invoice.customers?.name || 'Unknown',
      phone_number: invoice.customers?.phone_number || null,
      address: invoice.customers?.address || null,
    },
    items,
  });

  // Convert to base64
  const base64 = Buffer.from(pdfBytes).toString('base64');
  return base64;
}
