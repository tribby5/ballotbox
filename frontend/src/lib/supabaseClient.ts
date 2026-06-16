import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  const url = import.meta.env.SUPABASE_URL as string | undefined;
  const key = import.meta.env.SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (!url || !key) return null;
  client ??= createClient(url, key);
  return client;
}
