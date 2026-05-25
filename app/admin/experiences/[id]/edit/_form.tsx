"use client";

import { useActionState } from "react";
import { updateExperience } from "../../actions";
import { SubmitButton } from "../../../_components/SubmitButton";
import Link from "next/link";
import type { WorkExperience } from "@prisma/client";

const initialState = { error: "" };

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function EditExperienceForm({ experience }: { experience: WorkExperience }) {
  const updateWithId = updateExperience.bind(null, experience.id);
  const [state, formAction] = useActionState(updateWithId, initialState);

  return (
    <form action={formAction} className="bg-gray-900 rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Nama Perusahaan <span className="text-red-400">*</span>
          </label>
          <input
            name="company_name"
            required
            defaultValue={experience.company_name}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Jabatan <span className="text-red-400">*</span>
          </label>
          <input
            name="role"
            required
            defaultValue={experience.role}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-300 mb-1.5">Lokasi</label>
          <input
            name="location"
            defaultValue={experience.location ?? ""}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="Opsional"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Tanggal Mulai <span className="text-red-400">*</span>
          </label>
          <input
            name="start_date"
            type="date"
            required
            defaultValue={toDateInputValue(experience.start_date)}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Tanggal Selesai</label>
          <input
            name="end_date"
            type="date"
            defaultValue={toDateInputValue(experience.end_date)}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition"
          />
          <p className="text-gray-500 text-xs mt-1">Kosongkan jika masih aktif.</p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-300 mb-1.5">Deskripsi Tugas</label>
          <textarea
            name="description"
            rows={6}
            defaultValue={experience.description}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
            placeholder="Mendukung format Markdown."
          />
        </div>
      </div>

      {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label="Perbarui Pengalaman" />
        <Link
          href="/admin/experiences"
          className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
