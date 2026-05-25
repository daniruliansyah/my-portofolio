"use client";

import { useActionState } from "react";
import { createExperience } from "../actions";
import { SubmitButton } from "../../_components/SubmitButton";
import Link from "next/link";

const initialState = { error: "" };

export default function NewExperiencePage() {
  const [state, formAction] = useActionState(createExperience, initialState);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/experiences" className="text-gray-400 hover:text-white text-sm transition">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold">Tambah Pengalaman Kerja</h1>
      </div>

      <form action={formAction} className="bg-gray-900 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Nama Perusahaan <span className="text-red-400">*</span>
            </label>
            <input
              name="company_name"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              placeholder="e.g. CV. DBKLIK"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Jabatan <span className="text-red-400">*</span>
            </label>
            <input
              name="role"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              placeholder="e.g. Full-Stack Web Developer"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1.5">Lokasi</label>
            <input
              name="location"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              placeholder="e.g. Bandung, Jawa Barat (opsional)"
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
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Tanggal Selesai</label>
            <input
              name="end_date"
              type="date"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition"
            />
            <p className="text-gray-500 text-xs mt-1">Kosongkan jika masih aktif.</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1.5">Deskripsi Tugas</label>
            <textarea
              name="description"
              rows={6}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
              placeholder="Deskripsikan tanggung jawab dan pencapaian selama di posisi ini. Mendukung format Markdown."
            />
          </div>
        </div>

        {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <SubmitButton label="Simpan Pengalaman" />
          <Link
            href="/admin/experiences"
            className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm transition"
          >
            Batal
          </Link>
        </div>
      </form>

      <p className="text-gray-500 text-xs mt-4">
        Setelah disimpan, Anda dapat menambahkan gambar/screenshot melalui halaman edit.
      </p>
    </div>
  );
}
