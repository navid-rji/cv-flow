import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cv-flow.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "CVflow",
    template: "%s | CVflow",
  },

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
  creator: "CVflow",
  publisher: "CVflow",
  referrer: "origin-when-cross-origin",
  // Better UX on iOS/Android: auto-detect phone numbers etc.
  formatDetection: { telephone: true, email: true, address: true },
  // If you ship a PWA
  applicationName: "CVflow",

  openGraph: {
    title: "CVflow",
    description:
      "Create a polished CV without the hassle of formatting. Fast, simple, and export-ready.",
    url: "https://cv-flow.com",
    siteName: "CVflow",
    locale: "en_US",
    type: "website",
    // images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVflow",
    description:
      "Build your CV effortlessly. Just add your details — CVflow takes care of the formatting.",
    // images: [], // reuse your OG image
  },

  // iOS install-to-home-screen polish
  appleWebApp: {
    capable: true,
    title: "CVflow",
    statusBarStyle: "default",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono bg-background`}
      >
        <div className="min-h-screen">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
