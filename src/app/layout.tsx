import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Kodetic",
  description: "Kodetic",
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
