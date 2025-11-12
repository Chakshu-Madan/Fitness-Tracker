'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Auth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Timeout to prevent infinite loading
    const timer = setTimeout(() => {
      console.log('Auth load timeout - showing button');
      setLoading(false);
    }, 3000); // 3s max wait

    // Use getUser() instead of getSession() - faster & less hanging
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      clearTimeout(timer);
      console.log('getUser result:', { user: !!user, error });
      if (user) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
      if (error) setError(error.message);
    }).catch(err => {
      clearTimeout(timer);
      console.error('getUser error:', err);
      setError('Auth check failed: ' + err.message);
      setLoading(false);
    });

    return () => clearTimeout(timer);
  }, [router]);

  const handleGoogleSignIn = async () => {
    setError(null);
    console.log('Starting Google sign-in...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Sign-in error:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 text-white p-8">
        <div className="text-center">
          <p>Loading auth...</p>
          <p className="text-sm opacity-70 mt-2">Check console for logs (F12)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-4">AthleteHub</h1>
        <p className="text-purple-200 mb-8">Track. Train. Triumph.</p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23.99-3.71.99-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Login with Google
        </button>
        
        <p className="text-purple-200 mt-6 text-sm">Powered by Supabase</p>
      </div>
    </div>
  );
}