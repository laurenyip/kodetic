"use client";

import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen w-full flex-col overflow-x-clip">
      <header
        data-site-header
        className="sticky top-0 z-40 w-full bg-transparent"
      >
        <NavBar />
      </header>

      <main className="relative z-0 w-full min-h-[100vh] flex-1">{children}</main>

      <Footer />
      <BackToTop />
    </div>
  );
}
