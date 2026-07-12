"use client";

import { panelTransition } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";

type GalleryExpandBackdropProps = {
  open: boolean;
  onClose: () => void;
};

export default function GalleryExpandBackdrop({
  open,
  onClose,
}: GalleryExpandBackdropProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={panelTransition}
          onClick={onClose}
          className="fixed inset-0 z-20 cursor-default bg-black/55"
          aria-label="Close expanded image"
        />
      )}
    </AnimatePresence>
  );
}
