"use client";

import BackToTop from "@/components/BackToTop";
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
  const [focusNonce, setFocusNonce] = useState(0);
  const [activeView, setActiveView] = useState<ContentView>("editorial");

  const activeGalleryImage: ActiveImageContext | null = selectedImage
    ? {
        name: selectedImage.name,
        description: selectedImage.description,
        category: selectedImage.category,
        fullSrc: selectedImage.fullSrc,
      }
    : null;

  const activeImage: ActiveImage = hoveredImage
    ? {
        name: hoveredImage.name,
        // Prefer blank note-style description in the header for now
        description: "",
      }
    : selectedImage
      ? { name: selectedImage.name, description: "" }
      : null;

  const handleImageHover = useCallback((info: PhotoRiverImageInfo | null) => {
    setHoveredImage(info);
  }, []);

  const handleImageSelect = useCallback((info: PhotoRiverImageInfo) => {
    setSelectedImage(info);
    setFocusNonce((value) => value + 1);
    setActiveView(info.category);
  }, []);

  const handleCategorySelect = useCallback((category: PhotoRiverCategory) => {
    setHoveredImage(null);
    setSelectedImage(null);
    setActiveView(category);
  }, []);

  return (
    <div className="relative z-10 flex min-h-screen w-full flex-col overflow-x-clip">
      <header className="sticky top-0 z-40 w-full bg-transparent">
        <div className="bg-black/20 backdrop-blur-[1px]">
          <PhotoRiver
            onImageHover={handleImageHover}
            onImageSelect={handleImageSelect}
          />
        </div>

        <NavBar
          activeImage={activeImage}
          activeView={activeView}
          onCategorySelect={handleCategorySelect}
        />
      </header>

      <main className="relative z-0 w-full min-h-[100vh] flex-1">
        {activeView === "mixed-media" ? (
          <MixedMediaGrid
            images={mixedMediaImages}
            activeImage={activeGalleryImage}
            focusNonce={focusNonce}
          />
        ) : (
          <GalleryGrid
            images={galleryImages}
            category={activeView}
            activeImage={activeGalleryImage}
            focusNonce={focusNonce}
          />
        )}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
