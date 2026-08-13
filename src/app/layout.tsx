import type { Metadata } from "next";
import localFont from "next/font/local";
import { Red_Hat_Display } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { withBasePath } from "@/lib/base-path";
import "./globals.css";

/** Zodiak — from the Fontshare shortlist in the revision notes */
const zodiak = localFont({
  src: [
    { path: "../../public/fonts/Zodiak-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Zodiak-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

/** Red Hat Display — UI / body from the notes list */
const redHat = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kodetic",
  description: "Ezra Gillera — photography and mixed media.",
  icons: {
    icon: [{ url: withBasePath("/logo.png"), type: "image/png" }],
    apple: [{ url: withBasePath("/logo.png"), type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${zodiak.variable} ${redHat.variable}`}>
      <body className="canvas-surface">
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
