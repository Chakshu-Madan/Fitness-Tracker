// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/ssr';
import { supabase } from '../lib/supabase';
import '../styles/globals.css';  // Keep if you have global styles

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}