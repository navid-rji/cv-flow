import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVflow",
  description:
    "Generate a professional CV in minutes. Focus on your content while CVflow handles the formatting.",
  keywords: [
    "CV generator",
    "resume builder",
    "professional CV",
    "job application",
    "resume formatting",
    "career tools",
    "curriculum vitae",
    "CVflow",
    "cv-flow",
  ],
  authors: [{ name: "Navid Rajaei" }],
  openGraph: {
    title: "CVflow",
    description:
      "Create a polished CV without the hassle of formatting. Fast, simple, and export-ready.",
    url: "https://cv-flow.com",
    siteName: "CVflow",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVflow",
    description:
      "Build your CV effortlessly. Just add your details — CVflow takes care of the formatting.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
