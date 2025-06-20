import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube Downloader - Fast & Reliable Video Downloads",
  description:
    "Download YouTube videos quickly and easily with our bulletproof downloader. Simple, fast, and reliable.",
  keywords: [
    "YouTube downloader",
    "video download",
    "yt-dlp",
    "YouTube video converter",
  ],
  authors: [{ name: "YouTube Downloader Team" }],
  metadataBase: new URL("https://youtube-downloader.vercel.app"),
  openGraph: {
    title: "YouTube Downloader - Fast & Reliable Video Downloads",
    description:
      "Download YouTube videos quickly and easily with our bulletproof downloader.",
    url: "https://youtube-downloader.vercel.app",
    siteName: "YouTube Downloader",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Downloader",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Downloader - Fast & Reliable Video Downloads",
    description:
      "Download YouTube videos quickly and easily with our bulletproof downloader.",
    images: ["/icons/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-black text-white overscroll-none">{children}</body>
    </html>
  );
}
