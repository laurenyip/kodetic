import type { Metadata } from "next";
import localFont from "next/font/local";
import { Source_Sans_3 } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { withBasePath } from "@/lib/base-path";
import "./globals.css";

/** Ufficio trial — typographic family name is "Ufficio" */
const ufficio = localFont({
  src: [
    { path: "../../public/fonts/Ufficio-300.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Ufficio-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Ufficio-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Ufficio-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Ufficio-700.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Ufficio-800.ttf", weight: "800", style: "normal" },
    { path: "../../public/fonts/Ufficio-900.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
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
    <html lang="en" className={`${ufficio.variable} ${sourceSans.variable}`}>
      <body className="canvas-surface">
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
