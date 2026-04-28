import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Smart Course Registration Portal - UNIPORT",
    template: "%s | UNIPORT Course Registration",
  },
  description: "Intelligent course registration system for University of Port Harcourt students. Features AI-powered course suggestions, real-time validation, prerequisite checking, and smart conflict detection for seamless semester planning.",
  keywords: [
    "UNIPORT",
    "University of Port Harcourt",
    "course registration",
    "student portal",
    "academic registration",
    "semester registration",
    "course selection",
    "AI course suggestions",
    "smart registration",
    "Nigeria university",
  ],
  authors: [{ name: "UNIPORT IT Department" }],
  creator: "University of Port Harcourt",
  publisher: "University of Port Harcourt",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    title: "Smart Course Registration Portal - UNIPORT",
    description: "Intelligent course registration system with AI-powered suggestions, real-time validation, and smart conflict detection for University of Port Harcourt students.",
    siteName: "UNIPORT Course Registration",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Smart Course Registration Portal - University of Port Harcourt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Course Registration Portal - UNIPORT",
    description: "Intelligent course registration with AI-powered suggestions and real-time validation for UNIPORT students.",
    images: ["/opengraph-image"],
    creator: "@uniport",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
