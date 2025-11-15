import '../globals.css'; 
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner'; 

// 1. Import our SessionContextProvider
import { SessionContextProvider } from '../hooks/useSessionContext'; 

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