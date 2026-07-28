export type ClientLogo = {
  id: string;
  label: string;
};

/** Wordmark placeholders — swap for real client logos when available. */
export const clientLogos: ClientLogo[] = [
  { id: "mec", label: "MEC" },
  { id: "family", label: "FAMILY MGMT" },
  { id: "gt", label: "GT" },
  { id: "avgn", label: "AVGN" },
  { id: "maison", label: "MAISON" },
  { id: "stussy", label: "STUSSY" },
  { id: "nana", label: "NANA" },
  { id: "mirrorball", label: "MIRRORBALL" },
];
