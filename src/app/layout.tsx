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
  title: "GroundReady — Aviation Ground Operations Trainer",
  applicationName: "GroundReady",
  description:
    "Beginner-friendly, gamified ground-operations training for airport traffic assistants: Amadeus Altéa DCS, IATA DGR 2026, IGOM turnaround, IATA passenger rules and SAPS procedures.",
  keywords: [
    "GroundReady",
    "ground handling",
    "ground operations",
    "Altéa",
    "DCS",
    "IATA",
    "DGR",
    "IGOM",
    "TIMATIC",
    "SAPS",
    "check-in",
    "dangerous goods",
  ],
  openGraph: {
    title: "GroundReady — Aviation Ground Operations Trainer",
    description:
      "From first shift to station manager: gamified DCS, DGR, IGOM and IATA training for airport ground staff.",
    siteName: "GroundReady",
    type: "website",
  },
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
