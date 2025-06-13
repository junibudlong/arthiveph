// src/layout.tsx
import '@/components/globals.css'; // or your global styles
import Navbar from '@/components/Navbar'; // adjust path if Navbar is elsewhere
import { ReactNode } from 'react';

export const metadata = {
  title: 'ArtHivePH',
  description: 'Your Art Merchandise Platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-white text-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
