/** Shared content category keys used by nav + gallery. */
export type PhotoRiverCategory =
  | "home"
  | "commercial"
  | "creative"
  | "miscellaneous"
  | "mixed-media";

/** @deprecated River removed — kept for type import compatibility during transition. */
export type PhotoRiverImage = {
  id: string;
  src: string;
  fullSrc: string;
  name: string;
  description: string;
  category: PhotoRiverCategory;
};

export const photoRiverImages: PhotoRiverImage[] = [];
