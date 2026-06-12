// src/lib/supabase.ts
// Browser-side Supabase client — lazy singleton to avoid build-time errors
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
    _client = createClient(url, key);
  }
  return _client;
}

/** Proxy so imports like `supabase.auth` and `supabase.from()` work everywhere */
export const supabase = {
  get auth() { return getClient().auth; },
  from(table: string) { return getClient().from(table); },
  rpc(fn: string, args?: Record<string, unknown>) { return getClient().rpc(fn, args); },
};
