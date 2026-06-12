import { NextResponse } from 'next/server';
import supabaseServer from '@/src/lib/supabaseServer';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const customerId = url.searchParams.get('customer_id');
  const sb = supabaseServer();
  let q = sb.from('calendar_entries').select('*');
  if (customerId) q = q.eq('customer_id', customerId);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
