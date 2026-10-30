import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AltéaMaster — SAPS Ground Handling & DCS Trainer",
  description:
    "Gamified Amadeus Altéa DCS and airport ground-handling training for Traffic Assistants: check-in, boarding, IATA DGR 2026, GACA liquids, TIMATIC, overbooking and gate security scenarios.",
  keywords: [
    "Altéa",
    "DCS",
    "IATA",
    "GACA",
    "SAPS",
    "ground handling",
    "check-in",
    "TIMATIC",
    "dangerous goods",
  ],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
