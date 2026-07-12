import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { withBasePath } from "@/lib/base-path";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  axes: ["opsz"],
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
    <html lang="en" className={bricolageGrotesque.variable}>
      <body>
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
