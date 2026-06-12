import { NextResponse } from 'next/server';
import supabaseServer from '@/src/lib/supabaseServer';

type CalendarEntryPayload = {
  customer_id: string;
  entry_date: string;
  status: string;
  notes?: string;
};

type CalendarEntryWritePayload = {
  customer_id?: string;
  entry_date?: string;
  status: string;
  notes?: string;
  flower_type_id?: string;
  quantity?: number;
  rate?: number;
};

export async function POST(req: Request) {
  const body = (await req.json()) as CalendarEntryPayload;
  const { customer_id, entry_date, status, notes } = body;
  const sb = supabaseServer();

  const { data: existing } = await sb
    .from('calendar_entries')
    .select('id')
    .eq('customer_id', customer_id)
    .eq('entry_date', entry_date)
    .maybeSingle();

  if (existing) {
    if (status === 'Delivered' && !notes) {
      await sb.from('calendar_entries').delete().eq('id', existing.id);
      return NextResponse.json({ success: true });
    }
    const updatePayload: CalendarEntryWritePayload = { status, notes };
    const { error } = await sb.from('calendar_entries').update(updatePayload).eq('id', existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (status !== 'Delivered' || notes) {
    const insertPayload: CalendarEntryWritePayload = { customer_id, entry_date, status, notes };
    const { error } = await sb.from('calendar_entries').insert(insertPayload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
