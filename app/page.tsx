import { createClient } from '@/lib/supabase';
import Auth from '@/components/Auth';
import Dashboard from '@/components/pages/dashboard';

export default async function Home() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session ? <Dashboard /> : <Auth />;
}