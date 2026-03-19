import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DocuVault - Secure Document Management",
  description: "Never miss a document expiry again. Secure cloud storage with smart expiration reminders.",
  keywords: ["document management", "secure storage", "expiration reminders", "cloud vault"],
  authors: [{ name: "DocuVault" }],
  openGraph: {
    title: "DocuVault - Secure Document Management",
    description: "Never miss a document expiry again. Secure cloud storage with smart expiration reminders.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#10B981" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
