'use server';

import { supabaseServer } from '../../lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function getCalendarEntries(customerId: string) {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('calendar_entries')
    .select('*')
    .eq('customer_id', customerId);

  if (error) {
    console.error('Error fetching calendar entries:', error);
    return [];
  }
  return data;
}

export async function upsertCalendarEntry(customerId: string, entryDate: string, status: string, notes: string) {
  const sb = supabaseServer();
  // Check if entry already exists
  const { data: existing } = await sb
    .from('calendar_entries')
    .select('id')
    .eq('customer_id', customerId)
    .eq('entry_date', entryDate)
    .single();

  let result;

  if (existing) {
    if (status === 'Delivered' && !notes) {
      // "Delivered" is the default state. If there are no special notes, we can just delete the override
      // to keep the database clean, because the app assumes 'Delivered' if no record exists.
      result = await sb.from('calendar_entries').delete().eq('id', existing.id);
    } else {
      result = await sb
        .from('calendar_entries')
        .update({ status, notes })
        .eq('id', existing.id);
    }
  } else {
    // Only insert if it's NOT the default Delivered without notes, or if we strictly want to record it.
    // We'll record it anyway to be explicit if they clicked save.
    if (status !== 'Delivered' || notes) {
      result = await sb.from('calendar_entries').insert({
        customer_id: customerId,
        entry_date: entryDate,
        status,
        notes,
      });
    } else {
      // It's the default state and no record exists, so do nothing.
      return { success: true };
    }
  }

  if (result?.error) {
    console.error('Error upserting calendar entry:', result.error);
    return { success: false, error: result.error.message };
  }

  revalidatePath('/calendar');
  return { success: true };
}
