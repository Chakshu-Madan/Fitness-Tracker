// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/ssr';
import { supabase } from '../lib/supabase';
import '../styles/globals.css';   // keep your CSS

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