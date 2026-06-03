"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import type { Prisma } from "@prisma/client";

type ProjectWithDetails = Prisma.ProjectGetPayload<{
  include: {
    medias: true;
    skills: { include: { skill: true } };
  };
}>;

interface Props {
  project: ProjectWithDetails;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: Props) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const hasMultiple = project.medias.length > 1;
  const currentMedia = project.medias[mediaIndex];

  const prev = useCallback(
    () => setMediaIndex((i) => (i - 1 + project.medias.length) % project.medias.length),
    [project.medias.length]
  );
  const next = useCallback(
    () => setMediaIndex((i) => (i + 1) % project.medias.length),
    [project.medias.length]
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-2xl max-h-[88vh] bg-th-card rounded-2xl border border-th-border flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-th-border shrink-0">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              {project.category}
            </span>
            <h2 className="text-lg font-bold text-th-ink mt-0.5 leading-snug">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 mt-0.5 p-1.5 rounded-full text-th-muted hover:text-th-ink hover:bg-th-soft transition-colors"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Media gallery */}
          {project.medias.length > 0 && currentMedia && (
            <div className="space-y-2">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-th-soft">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mediaIndex}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentMedia.image_url}
                      alt={currentMedia.caption ?? project.title}
                      fill
                      unoptimized
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, 672px"
                    />
                  </motion.div>
                </AnimatePresence>

                {hasMultiple && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/65 text-white transition-colors"
                      aria-label="Sebelumnya"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/65 text-white transition-colors"
                      aria-label="Berikutnya"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Caption + counter */}
              <div className="flex items-start justify-between gap-3 px-1 min-h-[1.1rem]">
                <p className="text-xs text-th-muted italic flex-1">
                  {currentMedia.caption ?? ""}
                </p>
                {hasMultiple && (
                  <span className="text-xs text-th-muted tabular-nums shrink-0">
                    {mediaIndex + 1} / {project.medias.length}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {project.skills.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-th-muted mb-2">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.skills.map(({ skill }) => (
                  <span
                    key={skill.id}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-th-badge-bg text-th-badge border border-th-border"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-th-muted mb-2">
              Deskripsi
            </h3>
            <p className="text-sm text-th-muted leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Links */}
          {(project.github_url || project.project_url) && (
            <div className="flex flex-wrap gap-3 pb-1">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-th-soft hover:bg-th-border text-th-ink transition-colors"
                >
                  <Github size={14} /> GitHub
                </a>
              )}
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
