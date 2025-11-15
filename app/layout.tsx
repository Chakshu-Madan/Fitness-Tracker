import '../globals.css'; // FIX: Reverted to relative path
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

// 1. Import our SessionContextProvider
import { SessionContextProvider } from '../hooks/useSessionContext'; // FIX: Reverted to relative path

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
        {/* 2. Wrap your entire application in the provider. */}
        <SessionContextProvider>
          {children}
          <Toaster /> 
        </SessionContextProvider>
      </body>
    </html>
  );
}