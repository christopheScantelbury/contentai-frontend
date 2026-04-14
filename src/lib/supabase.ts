import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Client-side Supabase client (browser).
 * Use this in Client Components.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
