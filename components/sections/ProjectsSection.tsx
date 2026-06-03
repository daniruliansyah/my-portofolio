"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Github, ExternalLink, FolderGit2 } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { SectionHeader } from "./SectionHeader";
import ProjectDetailModal from "./ProjectDetailModal";

type ProjectWithDetails = Prisma.ProjectGetPayload<{
  include: {
    medias: true;
    skills: { include: { skill: true } };
  };
}>;

interface Props {
  projects: ProjectWithDetails[];
}

export default function ProjectsSection({ projects }: Props) {
  if (projects.length === 0) return null;

  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="mb-20 scroll-mt-20">
      <SectionHeader label="Featured Projects" />

      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-th-muted whitespace-nowrap">
              Other Projects
            </h3>
            <div className="flex-1 h-px bg-th-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i + featured.length} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ProjectCard({ project, index }: { project: ProjectWithDetails; index: number }) {
  const [modalOpen, setModalOpen] = useState(false);
  const thumbnail = project.medias[0]?.image_url ?? null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: index * 0.07, duration: 0.45 }}
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
        className="barca-card group bg-th-card rounded-2xl border border-th-border overflow-hidden hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-th-soft overflow-hidden">
          {thumbnail ? (
            <>
              <Image
                src={thumbnail}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {project.medias.length > 1 && (
                <span className="absolute bottom-2 right-2 text-[11px] font-semibold text-white bg-black/50 px-2 py-0.5 rounded-full pointer-events-none">
                  +{project.medias.length - 1} foto
                </span>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-th-muted">
              <FolderGit2 size={36} />
            </div>
          )}

          {project.featured && (
            <div className="absolute top-3 left-3 pointer-events-none">
              <span
                className="text-[11px] font-bold text-white px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <span
            className="text-[11px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "var(--accent)" }}
          >
            {project.category}
          </span>

          <h3 className="text-sm font-bold text-th-ink mb-2 group-hover:text-[var(--accent)] transition-colors leading-snug">
            {project.title}
          </h3>

          <p className="text-sm text-th-muted leading-relaxed mb-4 flex-1 line-clamp-3">
            {project.description}
          </p>

          {/* Skills preview */}
          {project.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.skills.slice(0, 4).map(({ skill }) => (
                <span
                  key={skill.id}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-th-badge-bg text-th-badge border border-th-border"
                >
                  {skill.name}
                </span>
              ))}
              {project.skills.length > 4 && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-th-soft text-th-muted">
                  +{project.skills.length - 4} lainnya
                </span>
              )}
            </div>
          )}

          {/* Links — stopPropagation agar tidak membuka modal */}
          <div
            className="flex gap-4 mt-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-th-muted hover:text-[var(--accent)] transition-colors"
              >
                <Github size={13} /> GitHub
              </a>
            )}
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-th-muted hover:text-[var(--accent)] transition-colors"
              >
                <ExternalLink size={13} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <ProjectDetailModal
            project={project}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
