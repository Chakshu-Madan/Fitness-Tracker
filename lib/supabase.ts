import { createClient } from '@supabase/supabase-js';

// NOTE: Please replace these environment variables with your actual keys.
// Vercel should be configured to use process.env.NEXT_PUBLIC_SUPABASE_URL and KEY.

// Check if running in a client environment before accessing window
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create the single Supabase client instance for use across the application
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This setting is crucial for Vercel/Next.js deployments. 
    // It prevents issues with the OAuth redirect state by only refreshing the session 
    // when a user manually interacts with the tab.
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, 
  }
});