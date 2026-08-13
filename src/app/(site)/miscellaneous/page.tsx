import GalleryGrid from "@/components/GalleryGrid";
import { galleryImages } from "@/data/gallery";

export default function MiscellaneousPage() {
  return <GalleryGrid images={galleryImages} category="miscellaneous" />;
}
