// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

// ONLY FOR CLIENT-SIDE (browser)
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );