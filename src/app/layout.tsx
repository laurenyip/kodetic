import type { Metadata } from "next";
import { Source_Sans_3, Syne } from "next/font/google";
import FontFaces from "@/components/FontFaces";
import SiteChrome from "@/components/SiteChrome";
import { withBasePath } from "@/lib/base-path";
import "./globals.css";

/** Geometric display fallback until Ufficio Display .woff2 files are added. */
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/** Simple body / description font */
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Kodetic",
  description: "Ezra Gillera — editorial photography and mixed media.",
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
    <html lang="en" className={`${syne.variable} ${sourceSans.variable}`}>
      <body className="canvas-surface">
        <FontFaces />
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
