// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionProvider } from 'hooks/useSessionContext';  // Custom provider
import '../styles/globals.css';  // Keep your global styles if they exist

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}