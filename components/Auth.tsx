'use client';

import { createBrowserClient } from '@supabase/ssr';

export default function Auth() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 text-center shadow-2xl border border-white/20">
        <h1 className="text-5xl font-bold text-white mb-4">AthleteHub</h1>
        <p className="text-white/80 mb-8 text-lg">Track. Train. Triumph.</p>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}