import LinenSheen from "@/components/LinenSheen";
import { Globe } from "lucide-react";
import type { SVGProps } from "react";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "instagram",
  },
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: "x",
  },
  {
    label: "Website",
    href: "https://ezragillera.com",
    icon: "globe",
  },
] as const;

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M5 5L19 19M19 5L5 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: (typeof SOCIAL_LINKS)[number]["icon"];
}) {
  const iconClassName =
    "h-5 w-5 transition-colors duration-hover ease-editorial group-hover:text-purple md:h-6 md:w-6";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-interactive="true"
      className="tap-target group inline-flex text-black transition-transform duration-hover ease-editorial hover:scale-110"
    >
      {icon === "instagram" && <InstagramIcon className={iconClassName} />}
      {icon === "x" && <XIcon className={iconClassName} />}
      {icon === "globe" && (
        <Globe className={`${iconClassName} stroke-[1.5]`} />
      )}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="footer-canvas relative z-10 w-full text-black">
      <LinenSheen />
      <div className="relative z-[1] flex min-h-[14rem] flex-col justify-between gap-10 px-5 py-12 sm:gap-12 md:min-h-[22vh] md:gap-14 md:px-8 md:py-16 lg:px-12">
        <p className="max-w-[16ch] text-left font-display text-xl font-semibold uppercase leading-tight tracking-[0.08em] text-black sm:text-2xl md:max-w-none md:text-3xl md:tracking-[0.1em] lg:text-[2rem]">
          HUMANS ARE BORN TO CREATE
        </p>

        <div className="flex w-full flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-xl space-y-3 font-sans text-sm font-normal leading-relaxed tracking-[0.02em] text-black md:text-base">
            <p>© 2026 Ezra Gillera. All rights reserved.</p>
            <p className="text-black/90">
              All artwork and photography on this site is original work. Do not
              reproduce, distribute, or use without written permission.
            </p>
            <a
              href="mailto:kodeticmedia@gmail.com?subject=Licensing%20%26%20Usage"
              data-interactive="true"
              className="inline-flex items-center gap-2 pt-1 font-display text-sm font-medium uppercase tracking-[0.18em] text-black transition-colors duration-hover ease-editorial hover:text-purple md:text-base"
            >
              Licensing &amp; Usage →
            </a>
          </div>

          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8 md:items-end md:flex-col md:gap-6 lg:flex-row lg:items-center">
            <a
              href="mailto:kodeticmedia@gmail.com"
              data-interactive="true"
              className="tap-target relative px-1 font-sans text-sm font-medium uppercase tracking-[0.16em] text-black transition-all duration-hover ease-editorial after:absolute after:bottom-1 after:left-1 after:right-1 after:h-px after:origin-left after:scale-x-0 after:bg-purple after:transition-transform after:duration-hover after:ease-editorial hover:tracking-[0.2em] hover:after:scale-x-100 md:text-base"
            >
              kodeticmedia@gmail.com
            </a>

            <div className="flex items-center gap-2 md:gap-3">
              {SOCIAL_LINKS.map((link) => (
                <SocialIcon
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
