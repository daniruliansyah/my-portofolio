"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface Props {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const hasMultiple = images.length > 1;
  const current = images[index];

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasMultiple) next();
      if (e.key === "ArrowLeft" && hasMultiple) prev();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, next, prev, hasMultiple]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Image + caption + counter */}
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="relative z-10 flex flex-col items-center w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-black/30"
          style={{ height: "70vh" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              <Image
                src={current.src}
                alt={current.alt || "Media"}
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {current.alt && (
          <p className="mt-3 text-sm text-white/70 text-center px-4">{current.alt}</p>
        )}
        {hasMultiple && (
          <p className="mt-1 text-xs text-white/40 tabular-nums">
            {index + 1} / {images.length}
          </p>
        )}
      </motion.div>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
        aria-label="Tutup"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          aria-label="Sebelumnya"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Next */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          aria-label="Berikutnya"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </motion.div>
  );
}
