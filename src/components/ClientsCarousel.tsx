"use client";

import { clientLogos } from "@/data/clients";

export default function ClientsCarousel() {
  const loop = [...clientLogos, ...clientLogos];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 py-5 md:py-7">
      <p className="mb-3 px-5 font-display text-[10px] uppercase tracking-[0.24em] text-white/40 md:px-8 md:text-[11px]">
        Clients
      </p>
      <div className="logo-marquee flex w-max items-center gap-10 px-5 md:gap-14 md:px-8">
        {loop.map((client, index) => (
          <span
            key={`${client.id}-${index}`}
            className="shrink-0 font-display text-sm uppercase tracking-[0.18em] text-white/35 transition-colors duration-hover ease-editorial hover:text-white/70 md:text-base md:tracking-[0.2em]"
          >
            {client.label}
          </span>
        ))}
      </div>
    </div>
  );
}
