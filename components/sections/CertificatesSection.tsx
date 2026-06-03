"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Award } from "lucide-react";
import type { Certificate } from "@prisma/client";
import { SectionHeader } from "./SectionHeader";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";

interface Props {
  certificates: Certificate[];
}

const SUPABASE_BASE =
  `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/storage/v1/object/public/portofolio-assets/certificates/`;

function resolveImageUrl(raw: string): string {
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return SUPABASE_BASE + raw.replace(/^\/+/, "");
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

interface LightboxState {
  images: LightboxImage[];
  initialIndex: number;
}

export default function CertificatesSection({ certificates }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="mb-20 scroll-mt-20">
      <SectionHeader label="Certificates" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            className="barca-card group bg-th-card rounded-2xl border border-th-border overflow-hidden hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* Certificate image — clickable */}
            <button
              type="button"
              disabled={!cert.image_url}
              onClick={() => {
                if (!cert.image_url) return;
                setLightbox({
                  images: [{ src: resolveImageUrl(cert.image_url), alt: cert.name }],
                  initialIndex: 0,
                });
              }}
              className="relative w-full aspect-video bg-th-soft overflow-hidden block cursor-pointer disabled:cursor-default group/img"
              aria-label={`Lihat sertifikat ${cert.name}`}
            >
              <Image
                src={resolveImageUrl(cert.image_url)}
                alt={cert.name}
                fill
                unoptimized
                className="object-cover group-hover/img:scale-[1.03] transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-300" />
            </button>

            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start gap-2 mb-1">
                <Award
                  size={14}
                  className="shrink-0 mt-0.5"
                  style={{ color: "var(--accent3)" }}
                />
                <h3 className="font-bold text-sm text-th-ink leading-snug line-clamp-2">
                  {cert.name}
                </h3>
              </div>

              <p className="text-xs font-semibold mb-3 mt-1" style={{ color: "var(--accent)" }}>
                {cert.issuing_org}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-th-muted">{formatDate(cert.issued_date)}</span>

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-th-muted hover:text-[var(--accent)] transition-colors"
                  >
                    Verify <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {cert.credential_id && (
                <p className="text-[11px] text-th-muted mt-2 truncate" title={cert.credential_id}>
                  ID: {cert.credential_id}
                </p>
              )}
            </div>
          </motion.div>
        ))}
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
