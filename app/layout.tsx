import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "@/components/notifications/notification-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Twitter - Share Your Thoughts",
    template: "%s | Twitter",
  },
  description:
    "A modern Twitter built with Next.js. Share your thoughts, connect with others, and stay updated with the latest conversations.",
  keywords: [
    "twitter",
    "social media",
    "microblogging",
    "tweets",
    "social network",
  ],
  authors: [{ name: "Twitter" }],
  creator: "Twitter",
  publisher: "Twitter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://twitter.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://twitter.com",
    siteName: "Twitter",
    title: "Twitter - Share Your Thoughts",
    description:
      "A modern Twitter built with Next.js. Share your thoughts, connect with others, and stay updated with the latest conversations.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Twitter - Share Your Thoughts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter - Share Your Thoughts",
    description:
      "A modern Twitter built with Next.js. Share your thoughts, connect with others, and stay updated with the latest conversations.",
    images: ["/logo.png"],
    creator: "@twitter",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>{children}</NotificationProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
