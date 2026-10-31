"use client";

import { useEffect, useState } from "react";

const MODES = [
  ["demo", "Demo data"],
  ["worst", "Worst case"],
  ["empty", "Empty"],
  ["one", "One"],
  ["huge", "300 photos"],
] as const;

export function useDevDataMode() {
  const [mode, setMode] = useState("demo");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    setMode(new URLSearchParams(window.location.search).get("data") ?? "demo");
  }, []);

  return mode;
}

/** Dev-only switch for the worst-case fixtures. Plain chrome, not part of the design. */
export default function DataToggle() {
  const active = useDevDataMode();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100000,
        display: "flex",
        gap: 2,
        padding: 2,
        borderRadius: 8,
        background: "#d4d4d8",
        font: "12px system-ui, sans-serif",
      }}
    >
      {MODES.map(([mode, label]) => (
        <a
          key={mode}
          href={mode === "demo" ? "?" : `?data=${mode}`}
          style={{
            padding: "4px 8px",
            borderRadius: 6,
            color: "#18181b",
            whiteSpace: "nowrap",
            background: active === mode ? "#fff" : "transparent",
          }}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
