// lib/supabase.ts
import { createPagesBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Check .env.local and Vercel.');
}

// This is the client you import everywhere
export const supabase = createPagesBrowserClient(supabaseUrl, supabaseAnonKey);