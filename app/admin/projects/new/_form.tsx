"use client";

import { useActionState } from "react";
import { createProject } from "../actions";
import { SubmitButton } from "../../_components/SubmitButton";
import Link from "next/link";
import type { Skill } from "@prisma/client";

const initialState = { error: "" };

type SkillsByCategory = Record<string, Skill[]>;

export function NewProjectForm({ skillsByCategory }: { skillsByCategory: SkillsByCategory }) {
  const [state, formAction] = useActionState(createProject, initialState);

  return (
    <form action={formAction} className="bg-gray-900 rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Judul Proyek <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            required
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="e.g. Sistem Deteksi Objek Computer Vision"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Kategori <span className="text-red-400">*</span>
          </label>
          <input
            name="category"
            required
            list="category-suggestions"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="e.g. Machine Learning, Backend"
          />
          <datalist id="category-suggestions">
            <option value="Backend" />
            <option value="Frontend" />
            <option value="Full-Stack" />
            <option value="Machine Learning" />
            <option value="Data Science" />
            <option value="Mobile" />
            <option value="DevOps" />
          </datalist>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">URL Live Website</label>
          <input
            name="project_url"
            type="url"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="https://... (opsional)"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">URL GitHub</label>
          <input
            name="github_url"
            type="url"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="https://github.com/... (opsional)"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-300 mb-1.5">Deskripsi Proyek</label>
          <textarea
            name="description"
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
            placeholder="Jelaskan tujuan, teknologi yang digunakan, dan pencapaian proyek. Mendukung format Markdown."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              className="w-4 h-4 rounded accent-blue-500"
            />
            <span className="text-sm text-gray-300">
              Tampilkan sebagai proyek unggulan di halaman utama
            </span>
          </label>
        </div>

        {Object.keys(skillsByCategory).length > 0 && (
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-3">Skill yang Digunakan</label>
            <div className="space-y-3">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <label
                        key={skill.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 cursor-pointer hover:border-blue-500 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10"
                      >
                        <input
                          type="checkbox"
                          name="skill_ids"
                          value={skill.id}
                          className="sr-only"
                        />
                        <span className="text-sm text-gray-300">{skill.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label="Simpan Proyek" />
        <Link
          href="/admin/projects"
          className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
