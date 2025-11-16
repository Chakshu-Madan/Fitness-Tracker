import '@/globals.css'; // FIX: Use absolute path
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { SessionContextProvider } from '@/hooks/useSessionContext'; // FIX: Use absolute path

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Fitness Tracker',
  description: 'Track your fitness journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionContextProvider>
          {children}
          <Toaster /> 
        </SessionContextProvider>
      </body>
    </html>
  );
}