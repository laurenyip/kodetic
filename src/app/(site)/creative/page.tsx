import GalleryGrid from "@/components/GalleryGrid";
import { galleryImages } from "@/data/gallery";

export default function CreativePage() {
  return <GalleryGrid images={galleryImages} category="creative" />;
}
