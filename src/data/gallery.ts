export type GalleryCategory =
  | "home"
  | "commercial"
  | "creative"
  | "miscellaneous"
  | "mixed-media";

export type GalleryImage = {
  id: string;
  src: string;
  fullSrc?: string;
  name: string;
  description: string;
  /** Longer hover/expand note — filled later by Ezra; blank for now */
  note?: string;
  category: GalleryCategory;
  /** Empty grid slot reserved for a missing PDF frame */
  placeholder?: boolean;
  /** Mixed-media board layout: full-width, or N images across one row */
  row?: "full" | number;
  /** Start a new row group even if column count matches the previous row */
  rowStart?: boolean;
  /** Width / height — used for equal-height rows */
  aspect?: number;
};

export const landingImages: GalleryImage[] = [
  {
    "id": "home-landing-page-photos-1",
    "src": "/images/grid/landing/landing-page-photos-1.webp",
    "fullSrc": "/images/landing/landing-page-photos-1.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-2",
    "src": "/images/grid/landing/landing-page-photos-2.webp",
    "fullSrc": "/images/landing/landing-page-photos-2.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-3",
    "src": "/images/grid/landing/landing-page-photos-3.webp",
    "fullSrc": "/images/landing/landing-page-photos-3.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-5",
    "src": "/images/grid/landing/landing-page-photos-5.webp",
    "fullSrc": "/images/landing/landing-page-photos-5.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-4",
    "src": "/images/grid/landing/landing-page-photos-4.webp",
    "fullSrc": "/images/landing/landing-page-photos-4.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-11",
    "src": "/images/grid/landing/landing-page-photos-11.webp",
    "fullSrc": "/images/landing/landing-page-photos-11.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-12",
    "src": "/images/grid/landing/landing-page-photos-12.webp",
    "fullSrc": "/images/landing/landing-page-photos-12.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-8",
    "src": "/images/grid/landing/landing-page-photos-8.webp",
    "fullSrc": "/images/landing/landing-page-photos-8.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-10",
    "src": "/images/grid/landing/landing-page-photos-10.webp",
    "fullSrc": "/images/landing/landing-page-photos-10.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-9",
    "src": "/images/grid/landing/landing-page-photos-9.webp",
    "fullSrc": "/images/landing/landing-page-photos-9.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-14",
    "src": "/images/grid/landing/landing-page-photos-14.webp",
    "fullSrc": "/images/landing/landing-page-photos-14.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-star",
    "src": "/images/grid/landing/landing-page-photos-star.webp",
    "fullSrc": "/images/landing/landing-page-photos-star.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-6",
    "src": "/images/grid/landing/landing-page-photos-6.webp",
    "fullSrc": "/images/landing/landing-page-photos-6.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-7",
    "src": "/images/grid/landing/landing-page-photos-7.webp",
    "fullSrc": "/images/landing/landing-page-photos-7.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-page-photos-13",
    "src": "/images/grid/landing/landing-page-photos-13.webp",
    "fullSrc": "/images/landing/landing-page-photos-13.webp",
    "name": "LANDING",
    "description": "Home selection",
    "category": "home"
  },
  {
    "id": "home-landing-margiela-spread",
    "src": "/images/grid/landing/landing-margiela-spread.webp",
    "fullSrc": "/images/landing/landing-margiela-spread.webp",
    "name": "MAISON MARGIELA",
    "description": "Landing spread",
    "category": "home"
  }
];

export const galleryImages: GalleryImage[] = [
  {
    "id": "commercial-client-work-photos-mec-1",
    "src": "/images/grid/commercial/client-work-photos-mec-1.webp",
    "fullSrc": "/images/commercial/client-work-photos-mec-1.webp",
    "name": "MEC",
    "description": "Client work",
    "category": "commercial",
    "aspect": 0.6678
  },
  {
    "id": "commercial-client-work-photos-mec-3",
    "src": "/images/grid/commercial/client-work-photos-mec-3.webp",
    "fullSrc": "/images/commercial/client-work-photos-mec-3.webp",
    "name": "MEC",
    "description": "Client work",
    "category": "commercial",
    "aspect": 1.3081
  },
  {
    "id": "commercial-client-work-photos-mec-2",
    "src": "/images/grid/commercial/client-work-photos-mec-2.webp",
    "fullSrc": "/images/commercial/client-work-photos-mec-2.webp",
    "name": "MEC",
    "description": "Client work",
    "category": "commercial",
    "aspect": 0.6678
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-1",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-1.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-1.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-2",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-2.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-2.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-3",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-3.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-3.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-4",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-4.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-4.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-5",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-5.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-5.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-6",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-6.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-6.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-7",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-7.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-7.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-8",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-8.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-8.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-9",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-9.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-9.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-10",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-10.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-10.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-11",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-11.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-11.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-12",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-12.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-12.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-13",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-13.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-13.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-14",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-14.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-14.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-15",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-15.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-15.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "commercial-client-work-photos-get-thrifty-fashion-show-16",
    "src": "/images/grid/commercial/client-work-photos-get-thrifty-fashion-show-16.webp",
    "fullSrc": "/images/commercial/client-work-photos-get-thrifty-fashion-show-16.webp",
    "name": "GET THRIFTY FASHION SHOW 2026",
    "description": "Client work",
    "category": "commercial"
  },
  {
    "id": "creative-creative-work-photos-12",
    "src": "/images/grid/creative/creative-work-photos-12.webp",
    "fullSrc": "/images/creative/creative-work-photos-12.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-6",
    "src": "/images/grid/creative/creative-work-photos-6.webp",
    "fullSrc": "/images/creative/creative-work-photos-6.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-8",
    "src": "/images/grid/creative/creative-work-photos-8.webp",
    "fullSrc": "/images/creative/creative-work-photos-8.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-10",
    "src": "/images/grid/creative/creative-work-photos-10.webp",
    "fullSrc": "/images/creative/creative-work-photos-10.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-14",
    "src": "/images/grid/creative/creative-work-photos-14.webp",
    "fullSrc": "/images/creative/creative-work-photos-14.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-11",
    "src": "/images/grid/creative/creative-work-photos-11.webp",
    "fullSrc": "/images/creative/creative-work-photos-11.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-15",
    "src": "/images/grid/creative/creative-work-photos-15.webp",
    "fullSrc": "/images/creative/creative-work-photos-15.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-9",
    "src": "/images/grid/creative/creative-work-photos-9.webp",
    "fullSrc": "/images/creative/creative-work-photos-9.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-7",
    "src": "/images/grid/creative/creative-work-photos-7.webp",
    "fullSrc": "/images/creative/creative-work-photos-7.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-13",
    "src": "/images/grid/creative/creative-work-photos-13.webp",
    "fullSrc": "/images/creative/creative-work-photos-13.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-2",
    "src": "/images/grid/creative/creative-work-photos-2.webp",
    "fullSrc": "/images/creative/creative-work-photos-2.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-3",
    "src": "/images/grid/creative/creative-work-photos-3.webp",
    "fullSrc": "/images/creative/creative-work-photos-3.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-4",
    "src": "/images/grid/creative/creative-work-photos-4.webp",
    "fullSrc": "/images/creative/creative-work-photos-4.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-30",
    "src": "/images/grid/creative/creative-work-photos-30.webp",
    "fullSrc": "/images/creative/creative-work-photos-30.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-45",
    "src": "/images/grid/creative/creative-work-photos-45.webp",
    "fullSrc": "/images/creative/creative-work-photos-45.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-27",
    "src": "/images/grid/creative/creative-work-photos-27.webp",
    "fullSrc": "/images/creative/creative-work-photos-27.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-26",
    "src": "/images/grid/creative/creative-work-photos-26.webp",
    "fullSrc": "/images/creative/creative-work-photos-26.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-29",
    "src": "/images/grid/creative/creative-work-photos-29.webp",
    "fullSrc": "/images/creative/creative-work-photos-29.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-32",
    "src": "/images/grid/creative/creative-work-photos-32.webp",
    "fullSrc": "/images/creative/creative-work-photos-32.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-37",
    "src": "/images/grid/creative/creative-work-photos-37.webp",
    "fullSrc": "/images/creative/creative-work-photos-37.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-33",
    "src": "/images/grid/creative/creative-work-photos-33.webp",
    "fullSrc": "/images/creative/creative-work-photos-33.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-34",
    "src": "/images/grid/creative/creative-work-photos-34.webp",
    "fullSrc": "/images/creative/creative-work-photos-34.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-35",
    "src": "/images/grid/creative/creative-work-photos-35.webp",
    "fullSrc": "/images/creative/creative-work-photos-35.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-36",
    "src": "/images/grid/creative/creative-work-photos-36.webp",
    "fullSrc": "/images/creative/creative-work-photos-36.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-24",
    "src": "/images/grid/creative/creative-work-photos-24.webp",
    "fullSrc": "/images/creative/creative-work-photos-24.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-19",
    "src": "/images/grid/creative/creative-work-photos-19.webp",
    "fullSrc": "/images/creative/creative-work-photos-19.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-20",
    "src": "/images/grid/creative/creative-work-photos-20.webp",
    "fullSrc": "/images/creative/creative-work-photos-20.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-21",
    "src": "/images/grid/creative/creative-work-photos-21.webp",
    "fullSrc": "/images/creative/creative-work-photos-21.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-22",
    "src": "/images/grid/creative/creative-work-photos-22.webp",
    "fullSrc": "/images/creative/creative-work-photos-22.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-23",
    "src": "/images/grid/creative/creative-work-photos-23.webp",
    "fullSrc": "/images/creative/creative-work-photos-23.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-38",
    "src": "/images/grid/creative/creative-work-photos-38.webp",
    "fullSrc": "/images/creative/creative-work-photos-38.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-5",
    "src": "/images/grid/creative/creative-work-photos-5.webp",
    "fullSrc": "/images/creative/creative-work-photos-5.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-40",
    "src": "/images/grid/creative/creative-work-photos-40.webp",
    "fullSrc": "/images/creative/creative-work-photos-40.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-42",
    "src": "/images/grid/creative/creative-work-photos-42.webp",
    "fullSrc": "/images/creative/creative-work-photos-42.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-39",
    "src": "/images/grid/creative/creative-work-photos-39.webp",
    "fullSrc": "/images/creative/creative-work-photos-39.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-1",
    "src": "/images/grid/creative/creative-work-photos-1.webp",
    "fullSrc": "/images/creative/creative-work-photos-1.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-31",
    "src": "/images/grid/creative/creative-work-photos-31.webp",
    "fullSrc": "/images/creative/creative-work-photos-31.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-41",
    "src": "/images/grid/creative/creative-work-photos-41.webp",
    "fullSrc": "/images/creative/creative-work-photos-41.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-16",
    "src": "/images/grid/creative/creative-work-photos-16.webp",
    "fullSrc": "/images/creative/creative-work-photos-16.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-17",
    "src": "/images/grid/creative/creative-work-photos-17.webp",
    "fullSrc": "/images/creative/creative-work-photos-17.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-18",
    "src": "/images/grid/creative/creative-work-photos-18.webp",
    "fullSrc": "/images/creative/creative-work-photos-18.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-25",
    "src": "/images/grid/creative/creative-work-photos-25.webp",
    "fullSrc": "/images/creative/creative-work-photos-25.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-43",
    "src": "/images/grid/creative/creative-work-photos-43.webp",
    "fullSrc": "/images/creative/creative-work-photos-43.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-28",
    "src": "/images/grid/creative/creative-work-photos-28.webp",
    "fullSrc": "/images/creative/creative-work-photos-28.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-creative-work-photos-44",
    "src": "/images/grid/creative/creative-work-photos-44.webp",
    "fullSrc": "/images/creative/creative-work-photos-44.webp",
    "name": "CREATIVE WORK",
    "description": "Creative work",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-15",
    "src": "/images/grid/creative/cosplay-photos-15.webp",
    "fullSrc": "/images/creative/cosplay-photos-15.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-13",
    "src": "/images/grid/creative/cosplay-photos-13.webp",
    "fullSrc": "/images/creative/cosplay-photos-13.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-2",
    "src": "/images/grid/creative/cosplay-photos-2.webp",
    "fullSrc": "/images/creative/cosplay-photos-2.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-1",
    "src": "/images/grid/creative/cosplay-photos-1.webp",
    "fullSrc": "/images/creative/cosplay-photos-1.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-6",
    "src": "/images/grid/creative/cosplay-photos-6.webp",
    "fullSrc": "/images/creative/cosplay-photos-6.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-16",
    "src": "/images/grid/creative/cosplay-photos-16.webp",
    "fullSrc": "/images/creative/cosplay-photos-16.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-17",
    "src": "/images/grid/creative/cosplay-photos-17.webp",
    "fullSrc": "/images/creative/cosplay-photos-17.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-12",
    "src": "/images/grid/creative/cosplay-photos-12.webp",
    "fullSrc": "/images/creative/cosplay-photos-12.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-10",
    "src": "/images/grid/creative/cosplay-photos-10.webp",
    "fullSrc": "/images/creative/cosplay-photos-10.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-9",
    "src": "/images/grid/creative/cosplay-photos-9.webp",
    "fullSrc": "/images/creative/cosplay-photos-9.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-4",
    "src": "/images/grid/creative/cosplay-photos-4.webp",
    "fullSrc": "/images/creative/cosplay-photos-4.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-5",
    "src": "/images/grid/creative/cosplay-photos-5.webp",
    "fullSrc": "/images/creative/cosplay-photos-5.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-14",
    "src": "/images/grid/creative/cosplay-photos-14.webp",
    "fullSrc": "/images/creative/cosplay-photos-14.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-3",
    "src": "/images/grid/creative/cosplay-photos-3.webp",
    "fullSrc": "/images/creative/cosplay-photos-3.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-11",
    "src": "/images/grid/creative/cosplay-photos-11.webp",
    "fullSrc": "/images/creative/cosplay-photos-11.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-8",
    "src": "/images/grid/creative/cosplay-photos-8.webp",
    "fullSrc": "/images/creative/cosplay-photos-8.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "creative-cosplay-photos-7",
    "src": "/images/grid/creative/cosplay-photos-7.webp",
    "fullSrc": "/images/creative/cosplay-photos-7.webp",
    "name": "COSPLAY",
    "description": "Cosplay",
    "category": "creative"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-6",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-6.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-6.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-14",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-14.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-14.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-15",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-15.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-15.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-3",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-3.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-3.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-4",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-4.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-4.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-2",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-2.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-2.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-5",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-5.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-5.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-1",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-1.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-1.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-11",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-11.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-11.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-8",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-8.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-8.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-10",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-10.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-10.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-9",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-9.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-9.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-7",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-7.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-7.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-12",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-12.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-12.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  },
  {
    "id": "miscellaneous-miscellaneous-photos-13",
    "src": "/images/grid/miscellaneous/miscellaneous-photos-13.webp",
    "fullSrc": "/images/miscellaneous/miscellaneous-photos-13.webp",
    "name": "MISCELLANEOUS",
    "description": "Miscellaneous",
    "category": "miscellaneous"
  }
];

export const mixedMediaImages: GalleryImage[] = [
  {
    "id": "mixed-media-mixed-media-photos-4",
    "src": "/images/mixed-media/mixed-media-photos-4.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-4.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": "full"
  },
  {
    "id": "mixed-media-mixed-media-photos-5",
    "src": "/images/mixed-media/mixed-media-photos-5.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-5.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": "full"
  },
  {
    "id": "mixed-media-mixed-media-photos-6",
    "src": "/images/mixed-media/mixed-media-photos-6.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-6.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": "full"
  },
  {
    "id": "mixed-media-mixed-media-margiela-spread",
    "src": "/images/mixed-media/mixed-media-margiela-spread.webp",
    "fullSrc": "/images/mixed-media/mixed-media-margiela-spread.webp",
    "name": "MAISON MARGIELA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": "full"
  },
  {
    "id": "mixed-media-mixed-media-margiela-trio",
    "src": "/images/mixed-media/mixed-media-margiela-trio.webp",
    "fullSrc": "/images/mixed-media/mixed-media-margiela-trio.webp",
    "name": "MAISON MARGIELA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": "full"
  },
  {
    "id": "mixed-media-mixed-media-margiela-quad",
    "src": "/images/mixed-media/mixed-media-margiela-quad.webp",
    "fullSrc": "/images/mixed-media/mixed-media-margiela-quad.webp",
    "name": "MAISON MARGIELA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": "full"
  },
  {
    "id": "mixed-media-mixed-media-photos-13",
    "src": "/images/mixed-media/mixed-media-photos-13.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-13.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": 3
  },
  {
    "id": "mixed-media-mixed-media-photos-12",
    "src": "/images/mixed-media/mixed-media-photos-12.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-12.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": 3
  },
  {
    "id": "mixed-media-mixed-media-photos-14",
    "src": "/images/mixed-media/mixed-media-photos-14.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-14.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": 3
  },
  {
    "id": "mixed-media-mixed-media-collage-trio",
    "src": "/images/mixed-media/mixed-media-collage-trio.webp",
    "fullSrc": "/images/mixed-media/mixed-media-collage-trio.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": "full"
  },
  {
    "id": "mixed-media-mixed-media-photos-10",
    "src": "/images/mixed-media/mixed-media-photos-10.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-10.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": 3,
    "rowStart": true
  },
  {
    "id": "mixed-media-mixed-media-photos-star",
    "src": "/images/mixed-media/mixed-media-photos-star.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-star.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": 3
  },
  {
    "id": "mixed-media-mixed-media-photos-11",
    "src": "/images/mixed-media/mixed-media-photos-11.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-11.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": 3
  },
  {
    "id": "mixed-media-mixed-media-photos-8",
    "src": "/images/mixed-media/mixed-media-photos-8.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-8.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": 3
  },
  {
    "id": "mixed-media-mixed-media-photos-7",
    "src": "/images/mixed-media/mixed-media-photos-7.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-7.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": 3
  },
  {
    "id": "mixed-media-mixed-media-photos-9",
    "src": "/images/mixed-media/mixed-media-photos-9.webp",
    "fullSrc": "/images/mixed-media/mixed-media-photos-9.webp",
    "name": "MIXED MEDIA",
    "description": "Mixed media",
    "category": "mixed-media",
    "row": 3
  }
];
