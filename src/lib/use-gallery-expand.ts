"use client";

import { useCallback, useEffect, useState } from "react";

export function useGalleryExpand() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const collapse = useCallback(() => {
    setExpandedId(null);
    setHoveredId(null);
  }, []);

  const expand = useCallback((id: string) => {
    setExpandedId(id);
  }, []);

  useEffect(() => {
    if (!expandedId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [expandedId, collapse]);

  return {
    hoveredId,
    setHoveredId,
    expandedId,
    expand,
    collapse,
    isExpanded: expandedId !== null,
  };
}
