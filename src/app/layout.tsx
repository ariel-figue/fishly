import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import Layout from "./components/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fishly - Track Catches, Find Fishing Spots, & Get Real-Time Updates",
  description:
    "Fishly is the ultimate fishing app for anglers! Log your catches, discover top fishing spots, get weather forecasts, and optimize your fishing trips with AI-powered insights.",
  keywords: [
    "fishing app",
    "fish tracking",
    "best fishing spots",
    "fishing weather updates",
    "fishing log",
    "fishing maps",
    "angler's companion",
    "real-time fishing data",
  ],
  openGraph: {
    title: "Fishly - Your Ultimate Fishing Companion",
    description:
      "Discover top fishing spots, track catches, and get real-time weather forecasts with Fishly. Designed for anglers who want the best fishing experience.",
    url: "https://fishly.com",
    type: "website",
    images: [
      {
        url: "https://fishly.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fishly - Your Fishing Companion",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}