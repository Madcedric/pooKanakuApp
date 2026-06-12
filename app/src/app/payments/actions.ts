'use server';

import { supabaseServer } from '../../lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function getPayments() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('payments')
    .select(`
      *,
      customers ( id, name ),
      invoices ( id, billing_month, total_amount, outstanding_amount )
    `)
    .order('payment_date', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
  return data;
}

export async function getCustomersForDropdown() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('customers')
    .select('id, name')
    .order('name');
  if (error) return [];
  return data;
}

export async function getOutstandingInvoices(customerId: string) {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('invoices')
    .select('id, billing_month, total_amount, paid_amount, outstanding_amount')
    .eq('customer_id', customerId)
    .in('status', ['Unpaid', 'Partially Paid'])
    .order('billing_month', { ascending: true });

  if (error) return [];
  return data;
}

export async function createPayment(formData: FormData) {
  const customerId = formData.get('customer_id') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const paymentDate = formData.get('payment_date') as string;
  const paymentMethod = formData.get('payment_method') as string;
  const invoiceId = formData.get('invoice_id') as string || null;
  const referenceNumber = formData.get('reference_number') as string || null;
  const notes = formData.get('notes') as string || null;

  if (!customerId || !amount || !paymentDate) {
    return { success: false, error: 'Customer, amount, and date are required' };
  }

  const sb = supabaseServer();

  // Insert payment
  const { error: paymentError } = await sb.from('payments').insert({
    customer_id: customerId,
    amount,
    payment_date: paymentDate,
    payment_method: paymentMethod || null,
    invoice_id: invoiceId || null,
    reference_number: referenceNumber,
    notes,
  });

  if (paymentError) {
    console.error('Error creating payment:', paymentError);
    return { success: false, error: paymentError.message };
  }

  // Update invoice paid_amount and status if linked
  if (invoiceId) {
    const { data: invoice } = await sb
      .from('invoices')
      .select('total_amount, paid_amount')
      .eq('id', invoiceId)
      .single();

    if (invoice) {
      const newPaidAmount = (invoice.paid_amount || 0) + amount;
      const newStatus = newPaidAmount >= invoice.total_amount
        ? 'Paid'
        : newPaidAmount > 0
          ? 'Partially Paid'
          : 'Unpaid';

      await sb
        .from('invoices')
        .update({ paid_amount: newPaidAmount, status: newStatus })
        .eq('id', invoiceId);
    }
  }

  revalidatePath('/payments');
  revalidatePath('/');
  revalidatePath('/billing');
  return { success: true };
}

export async function deletePayment(id: string) {
  const sb = supabaseServer();

  // Get payment details before deleting to reverse invoice update
  const { data: payment } = await sb
    .from('payments')
    .select('invoice_id, amount')
    .eq('id', id)
    .single();

  const { error } = await sb.from('payments').delete().eq('id', id);

  if (error) {
    console.error('Error deleting payment:', error);
    return { success: false, error: error.message };
  }

  // Reverse invoice update if linked
  if (payment?.invoice_id) {
    const { data: invoice } = await sb
      .from('invoices')
      .select('total_amount, paid_amount')
      .eq('id', payment.invoice_id)
      .single();

    if (invoice) {
      const newPaidAmount = Math.max(0, (invoice.paid_amount || 0) - payment.amount);
      const newStatus = newPaidAmount >= invoice.total_amount
        ? 'Paid'
        : newPaidAmount > 0
          ? 'Partially Paid'
          : 'Unpaid';

      await sb
        .from('invoices')
        .update({ paid_amount: newPaidAmount, status: newStatus })
        .eq('id', payment.invoice_id);
    }
  }

  revalidatePath('/payments');
  revalidatePath('/');
  revalidatePath('/billing');
  return { success: true };
}
