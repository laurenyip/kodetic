import GalleryGrid from "@/components/GalleryGrid";
import { galleryImages } from "@/data/gallery";

export default function CosplayPage() {
  return <GalleryGrid images={galleryImages} category="cosplay" />;
}
