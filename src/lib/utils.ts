export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Unique label for a photo without its own alt text, so each one is distinguishable. */
export function photoLabel(name: string, position: number, total: number) {
  const title = name.trim();
  if (total <= 1) return title || "Photo";
  return title
    ? `${title}, photo ${position} of ${total}`
    : `Photo ${position} of ${total}`;
}
