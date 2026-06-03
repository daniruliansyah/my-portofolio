"use client";

import { motion } from "framer-motion";
import type { Skill } from "@prisma/client";
import { SectionHeader } from "./SectionHeader";

interface Props {
  skills: Skill[];
}

export default function SkillsSection({ skills }: Props) {
  if (skills.length === 0) return null;

  // Group skills by category, preserving insertion order
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="mb-20 scroll-mt-20">
      <SectionHeader label="Tech Stack" />

      <div className="space-y-7">
        {Object.entries(grouped).map(([category, categorySkills], i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-th-muted mb-3">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <span
                  key={skill.id}
                  className="barca-badge px-4 py-1.5 rounded-full text-sm font-medium bg-th-badge-bg text-th-badge border border-th-border hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-200 cursor-default select-none"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
