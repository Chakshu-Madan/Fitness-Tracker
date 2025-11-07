import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import Dashboard from '@/components/pages/dashboard';

export default async function Home() {
  // Check if user is logged in (server-side)
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <>
      {session ? <Dashboard /> : <Auth />}
    </>
  );
}