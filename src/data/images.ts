export type PhotoRiverCategory =
  | "commercial"
  | "editorial"
  | "art"
  | "cosplay"
  | "mixed-media";

export type PhotoRiverImage = {
  id: string;
  src: string;
  fullSrc: string;
  name: string;
  description: string;
  category: PhotoRiverCategory;
};

export const photoRiverImages: PhotoRiverImage[] = [
  {
    "id": "01",
    "src": "/images/river/01.webp",
    "fullSrc": "/images/commercial/kodetic-mec-shoot-2.webp",
    "name": "MEC / COMMERCIAL",
    "description": "Commercial campaign",
    "category": "commercial"
  },
  {
    "id": "02",
    "src": "/images/river/02.webp",
    "fullSrc": "/images/cosplay/alien-eu-series-119-of-257.webp",
    "name": "ALIEN EU SERIES",
    "description": "Cosplay editorial",
    "category": "cosplay"
  },
  {
    "id": "03",
    "src": "/images/river/03.webp",
    "fullSrc": "/images/cosplay/kodetic-harper-57.webp",
    "name": "HARPER",
    "description": "Cosplay portrait",
    "category": "cosplay"
  },
  {
    "id": "04",
    "src": "/images/river/04.webp",
    "fullSrc": "/images/cosplay/moon-and-friends-edited-13-of-108.webp",
    "name": "MOON & FRIENDS",
    "description": "Group cosplay",
    "category": "cosplay"
  },
  {
    "id": "05",
    "src": "/images/river/05.webp",
    "fullSrc": "/images/cosplay/moon-and-kei-1-of-248.webp",
    "name": "MOON & KEI",
    "description": "Cosplay duo",
    "category": "cosplay"
  },
  {
    "id": "06",
    "src": "/images/river/06.webp",
    "fullSrc": "/images/editorial/ava-portraits-final-109-of-110.webp",
    "name": "AVA / PORTRAITS",
    "description": "Portrait series",
    "category": "editorial"
  },
  {
    "id": "07",
    "src": "/images/river/07.webp",
    "fullSrc": "/images/editorial/bandana-shoot-edited-2-of-34.webp",
    "name": "BANDANA SHOOT EDITED",
    "description": "Portrait & editorial",
    "category": "art"
  },
  {
    "id": "08",
    "src": "/images/river/08.webp",
    "fullSrc": "/images/editorial/coco-family-management-19.webp",
    "name": "COCO",
    "description": "Talent portrait",
    "category": "editorial"
  },
  {
    "id": "09",
    "src": "/images/river/09.webp",
    "fullSrc": "/images/editorial/evenscore-45-of-76.webp",
    "name": "EVENSCORE",
    "description": "Portrait & editorial",
    "category": "art"
  },
  {
    "id": "10",
    "src": "/images/river/10.webp",
    "fullSrc": "/images/editorial/ezragillera-fashion-editorial-5.webp",
    "name": "EZRA GILLERA",
    "description": "Fashion editorial",
    "category": "editorial"
  },
  {
    "id": "11",
    "src": "/images/river/11.webp",
    "fullSrc": "/images/editorial/gt-fashion-show-2026-ezra-s-edits-1-of-18.webp",
    "name": "GT FASHION SHOW 2026",
    "description": "Runway editorial",
    "category": "editorial"
  },
  {
    "id": "12",
    "src": "/images/river/12.webp",
    "fullSrc": "/images/editorial/isaiah-family-management-1.webp",
    "name": "ISAIAH",
    "description": "Talent portrait",
    "category": "editorial"
  },
  {
    "id": "13",
    "src": "/images/river/13.webp",
    "fullSrc": "/images/editorial/jasmy-edited-10-of-25.webp",
    "name": "JASMY",
    "description": "Editorial portrait",
    "category": "editorial"
  },
  {
    "id": "14",
    "src": "/images/river/14.webp",
    "fullSrc": "/images/editorial/jing-12.webp",
    "name": "JING",
    "description": "Portrait",
    "category": "editorial"
  },
  {
    "id": "15",
    "src": "/images/river/15.webp",
    "fullSrc": "/images/editorial/kelly-final-32.webp",
    "name": "KELLY",
    "description": "Portrait",
    "category": "editorial"
  },
  {
    "id": "16",
    "src": "/images/river/16.webp",
    "fullSrc": "/images/editorial/kodetic-avgn-arina-13.webp",
    "name": "AVGN - ARINA",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "17",
    "src": "/images/river/17.webp",
    "fullSrc": "/images/editorial/kodetic-avgn-avery-4.webp",
    "name": "AVGN - AVERY",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "18",
    "src": "/images/river/18.webp",
    "fullSrc": "/images/editorial/kodetic-avgn-brie-1.webp",
    "name": "AVGN - BRIE",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "19",
    "src": "/images/river/19.webp",
    "fullSrc": "/images/editorial/kodetic-avgn-ocean-8.webp",
    "name": "AVGN - OCEAN",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "20",
    "src": "/images/river/20.webp",
    "fullSrc": "/images/editorial/kodetic-avgn-shannon-108.webp",
    "name": "AVGN - SHANNON",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "21",
    "src": "/images/river/21.webp",
    "fullSrc": "/images/editorial/kodetic-brie-film-final-18-v2.webp",
    "name": "BRIE FILM - FINAL",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "22",
    "src": "/images/river/22.webp",
    "fullSrc": "/images/editorial/kodetic-chiffon-166.webp",
    "name": "CHIFFON #166",
    "description": "Editorial",
    "category": "art"
  },
  {
    "id": "23",
    "src": "/images/river/23.webp",
    "fullSrc": "/images/editorial/kodetic-ellie-2-of-72.webp",
    "name": "ELLIE",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "24",
    "src": "/images/river/24.webp",
    "fullSrc": "/images/editorial/kodetic-funky-83.webp",
    "name": "FUNKY #83",
    "description": "Editorial",
    "category": "art"
  },
  {
    "id": "25",
    "src": "/images/river/25.webp",
    "fullSrc": "/images/editorial/kodetic-geni-5.webp",
    "name": "GENI",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "26",
    "src": "/images/river/26.webp",
    "fullSrc": "/images/editorial/kodetic-gt-shoot-18-of-24-final-edit.webp",
    "name": "GT SHOOT",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "27",
    "src": "/images/river/27.webp",
    "fullSrc": "/images/editorial/kodetic-izzie-8.webp",
    "name": "IZZIE",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "28",
    "src": "/images/river/28.webp",
    "fullSrc": "/images/editorial/kodetic-jarrel-and-michaela-12-of-93.webp",
    "name": "JARREL AND MICHAELA",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "29",
    "src": "/images/river/29.webp",
    "fullSrc": "/images/editorial/kodetic-mirrorball-151.webp",
    "name": "MIRRORBALL #151",
    "description": "Editorial",
    "category": "art"
  },
  {
    "id": "30",
    "src": "/images/river/30.webp",
    "fullSrc": "/images/editorial/kodetic-pink-59.webp",
    "name": "PINK #59",
    "description": "Editorial",
    "category": "art"
  },
  {
    "id": "31",
    "src": "/images/river/31.webp",
    "fullSrc": "/images/editorial/kodetic-rea-146-of-146.webp",
    "name": "REA",
    "description": "Editorial",
    "category": "editorial"
  },
  {
    "id": "32",
    "src": "/images/river/32.webp",
    "fullSrc": "/images/editorial/mac-angie-ramya-s-lookbook-collection-19-of-21.webp",
    "name": "MAC, ANGIE, RAMYA'S LOOKBOOK COLLECTION",
    "description": "Portrait & editorial",
    "category": "editorial"
  },
  {
    "id": "33",
    "src": "/images/river/33.webp",
    "fullSrc": "/images/editorial/mateo-family-management-24-of-103.webp",
    "name": "MATEO",
    "description": "Talent portrait",
    "category": "editorial"
  },
  {
    "id": "34",
    "src": "/images/river/34.webp",
    "fullSrc": "/images/editorial/sohpia-s-lookbook-collection-10-of-10.webp",
    "name": "SOPHIA / LOOKBOOK",
    "description": "Fashion lookbook",
    "category": "editorial"
  },
  {
    "id": "35",
    "src": "/images/river/35.webp",
    "fullSrc": "/images/mixed-media/cam-s-grid-1.webp",
    "name": "CAM'S GRID",
    "description": "Grid composition",
    "category": "mixed-media"
  },
  {
    "id": "36",
    "src": "/images/river/36.webp",
    "fullSrc": "/images/mixed-media/kodetic-jarrel-and-michaela-52-of-93-final.webp",
    "name": "JARREL & MICHAELA",
    "description": "Mixed media portrait",
    "category": "mixed-media"
  },
  {
    "id": "37",
    "src": "/images/river/37.webp",
    "fullSrc": "/images/mixed-media/nana-final-edit-10.webp",
    "name": "NANA / MIXED MEDIA",
    "description": "Collage series",
    "category": "mixed-media"
  },
  {
    "id": "38",
    "src": "/images/river/38.webp",
    "fullSrc": "/images/mixed-media/rea-crt-angel.webp",
    "name": "REA / LIMINAL",
    "description": "CRT & digital collage",
    "category": "mixed-media"
  },
  {
    "id": "39",
    "src": "/images/river/39.webp",
    "fullSrc": "/images/mixed-media/stiussy-ufnny-5.webp",
    "name": "STUSSY STUDIES",
    "description": "Mixed media edit",
    "category": "mixed-media"
  },
  {
    "id": "40",
    "src": "/images/river/40.webp",
    "fullSrc": "/images/mixed-media/stusys-noys-136.webp",
    "name": "MIXED MEDIA",
    "description": "sTUSYS NOYS (136)",
    "category": "mixed-media"
  }
];
