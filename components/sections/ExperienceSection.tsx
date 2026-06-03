"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Prisma } from "@prisma/client";
import { SectionHeader } from "./SectionHeader";
import { MapPin, Calendar } from "lucide-react";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";

type WorkExperienceWithMedias = Prisma.WorkExperienceGetPayload<{
  include: { medias: true };
}>;

interface Props {
  workExperiences: WorkExperienceWithMedias[];
}

function formatPeriod(start: Date, end: Date | null): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
  const startStr = new Date(start).toLocaleDateString("id-ID", opts);
  const endStr = end ? new Date(end).toLocaleDateString("id-ID", opts) : "Sekarang";
  return `${startStr} – ${endStr}`;
}

interface LightboxState {
  images: LightboxImage[];
  initialIndex: number;
}

export default function ExperienceSection({ workExperiences }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  if (workExperiences.length === 0) return null;

  return (
    <section id="experience" className="mb-20 scroll-mt-20">
      <SectionHeader label="Work Experience" />

      <div className="relative">
        {/* Vertical timeline line */}
        <div
          className="timeline-line absolute left-[11px] top-2 bottom-2 w-[2px] bg-th-border rounded-full"
          aria-hidden="true"
        />

        <div className="space-y-6 pl-8">
          {workExperiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div
                className="absolute -left-8 top-5 w-[10px] h-[10px] rounded-full border-2 border-th-border bg-th-bg"
                style={{ marginLeft: "-4px" }}
              />

              <div className="barca-card bg-th-card rounded-2xl border border-th-border p-5 hover:border-[var(--accent)] transition-all duration-300 group">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-th-ink group-hover:text-[var(--accent)] transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                      {exp.company_name}
                    </p>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-th-badge-bg text-th-badge px-3 py-1 rounded-full border border-th-border">
                      <Calendar size={11} />
                      {formatPeriod(exp.start_date, exp.end_date)}
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-th-muted">
                        <MapPin size={11} /> {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-th-muted leading-relaxed mb-4 whitespace-pre-line">
                  {exp.description}
                </p>

                {/* Media thumbnails */}
                {exp.medias.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-1 -mb-1">
                    {exp.medias.map((media, mediaIdx) => (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() =>
                          setLightbox({
                            images: exp.medias.map((m) => ({
                              src: m.image_url,
                              alt: m.caption ?? "",
                            })),
                            initialIndex: mediaIdx,
                          })
                        }
                        className="group/thumb relative shrink-0 w-36 h-24 rounded-xl overflow-hidden bg-th-soft border border-th-border cursor-pointer"
                        aria-label={media.caption ?? "Lihat gambar"}
                      >
                        <Image
                          src={media.image_url}
                          alt={media.caption ?? "Screenshot"}
                          fill
                          className="object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          sizes="144px"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/25 transition-colors duration-300" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            initialIndex={lightbox.initialIndex}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
