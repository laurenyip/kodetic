import GalleryGrid from "@/components/GalleryGrid";
import { galleryImages } from "@/data/gallery";

export default function ClientWorkPage() {
  return <GalleryGrid images={galleryImages} category="commercial" />;
}
