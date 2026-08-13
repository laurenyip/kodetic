import GalleryGrid from "@/components/GalleryGrid";
import { landingImages } from "@/data/gallery";

export default function HomePage() {
  return <GalleryGrid images={landingImages} category="home" />;
}
