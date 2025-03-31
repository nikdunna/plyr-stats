'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isGamePage = pathname.startsWith('/game');

  return (
    <div className="flex flex-col min-h-screen">
      {!isGamePage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isGamePage && <Footer />}
    </div>
  );
} 