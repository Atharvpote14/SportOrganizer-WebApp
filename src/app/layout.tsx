import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sport Organizer - Tournament Management Platform",
  description: "A centralized platform for managing sports tournaments, teams, and competitions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1">{children}</main>
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
