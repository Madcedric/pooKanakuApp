// src/lib/supabaseServer.ts
// Server-side Supabase client (service role) — use only in server runtime.
// For server actions and API routes that need elevated privileges.
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getServerClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase server client requires SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }

  _client = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  return _client;
}

/** Get a server-side Supabase client with service role privileges. */
export function supabaseServer(): SupabaseClient {
  return getServerClient();
}

export default supabaseServer;
