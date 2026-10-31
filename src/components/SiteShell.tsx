"use client";

import BackToTop from "@/components/BackToTop";
import DataToggle from "@/dev/DataToggle";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { MotionConfig } from "framer-motion";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {/* data-site-shell: the gallery dialog marks this inert while it is open */}
      <div
        data-site-shell
        className="relative z-10 flex min-h-svh w-full flex-col overflow-x-clip"
      >
        <div
          data-site-header
          className="sticky top-0 z-40 w-full bg-transparent"
        >
          <NavBar />
        </div>

        <main className="relative z-0 w-full min-h-svh flex-1 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]">{children}</main>

        <Footer />
        <BackToTop />
        <DataToggle />
      </div>
    </MotionConfig>
  );
}
