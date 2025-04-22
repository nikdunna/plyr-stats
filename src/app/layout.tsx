import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import LayoutWrapper from "@/components/LayoutWrapper";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlyrStats - Volleyball Analytics",
  description: "Advanced volleyball analytics for coaches and players",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        <SessionWrapper session={session}>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
