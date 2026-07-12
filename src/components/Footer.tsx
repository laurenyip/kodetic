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
    "h-4 w-4 transition-colors duration-hover ease-editorial group-hover:text-red md:h-[18px] md:w-[18px]";

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
    <footer className="relative z-10 w-full bg-white text-black">
      <div className="flex min-h-[12rem] flex-col justify-between gap-8 px-5 py-10 sm:gap-10 md:min-h-[18vh] md:gap-12 md:px-8 md:py-14 lg:px-10">
        <p className="max-w-[18ch] text-left text-base font-bold uppercase leading-tight tracking-[0.06em] sm:text-lg md:max-w-none md:text-2xl md:tracking-[0.08em] lg:text-[1.75rem]">
          HUMANS ARE BORN TO CREATE
        </p>

        <div className="flex w-full flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-end sm:gap-8">
          <a
            href="mailto:hello@ezragillera.com"
            data-interactive="true"
            className="tap-target relative px-1 text-[11px] uppercase tracking-[0.18em] text-black transition-all duration-hover ease-editorial after:absolute after:bottom-2 after:left-1 after:right-1 after:h-px after:origin-left after:scale-x-0 after:bg-red after:transition-transform after:duration-hover after:ease-editorial hover:tracking-[0.24em] hover:after:scale-x-100 md:text-[12px]"
          >
            hello@ezragillera.com
          </a>

          <div className="flex items-center gap-1 md:gap-2">
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
    </footer>
  );
}
