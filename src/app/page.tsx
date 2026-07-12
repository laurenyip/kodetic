"use client";

import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import MixedMediaGrid from "@/components/MixedMediaGrid";
import NavBar, {
  type ActiveImage,
  type ContentView,
} from "@/components/NavBar";
import PhotoRiver, { type PhotoRiverImageInfo } from "@/components/PhotoRiver";
import { galleryImages, mixedMediaImages } from "@/data/gallery";
import type { PhotoRiverCategory } from "@/data/images";
import type { ActiveImageContext } from "@/lib/gallery-highlight";
import { useCallback, useState } from "react";

export default function Home() {
  const [hoveredImage, setHoveredImage] = useState<PhotoRiverImageInfo | null>(
    null,
  );
  const [selectedImage, setSelectedImage] =
    useState<PhotoRiverImageInfo | null>(null);
  const [activeView, setActiveView] = useState<ContentView>("photography");
  const [activeFilter, setActiveFilter] = useState<PhotoRiverCategory | null>(
    null,
  );

  const activeGalleryImage: ActiveImageContext | null = selectedImage;
  const activeImage: ActiveImage = hoveredImage ?? selectedImage;

  const focusFromRiver = useCallback((info: PhotoRiverImageInfo) => {
    setActiveFilter(null);
    setActiveView(
      info.category === "mixed-media" ? "mixed-media" : "photography",
    );
  }, []);

  const handleImageHover = useCallback((info: PhotoRiverImageInfo | null) => {
    setHoveredImage(info);
  }, []);

  const handleImageSelect = useCallback(
    (info: PhotoRiverImageInfo) => {
      setSelectedImage(info);
      focusFromRiver(info);
    },
    [focusFromRiver],
  );

  const handleFilterSelect = useCallback((category: PhotoRiverCategory) => {
    setHoveredImage(null);
    setActiveView("photography");
    setActiveFilter(category);
  }, []);

  const handleMixedMediaSelect = useCallback(() => {
    setHoveredImage(null);
    setActiveView("mixed-media");
    setActiveFilter(null);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip">
      <header className="sticky top-0 z-40 w-full bg-black">
        <PhotoRiver
          onImageHover={handleImageHover}
          onImageSelect={handleImageSelect}
        />

        <NavBar
          activeImage={activeImage}
          activeView={activeView}
          activeFilter={activeFilter}
          onFilterSelect={handleFilterSelect}
          onMixedMediaSelect={handleMixedMediaSelect}
        />
      </header>

      <main className="relative z-0 w-full min-h-[100vh] flex-1">
        {activeView === "mixed-media" ? (
          <MixedMediaGrid
            images={mixedMediaImages}
            activeImage={activeGalleryImage}
          />
        ) : (
          <GalleryGrid
            images={galleryImages}
            filter={activeFilter}
            activeImage={activeGalleryImage}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
