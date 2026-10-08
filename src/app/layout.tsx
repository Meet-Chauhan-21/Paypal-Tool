import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { HeyPayPalProvider } from "@/components/hey-paypal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ProcurePilot — Hey PayPal",
  description: "Voice-first agentic commerce & AI procurement platform. AI can act. You stay in control.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-app font-sans text-ink antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <HeyPayPalProvider>{children}</HeyPayPalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
