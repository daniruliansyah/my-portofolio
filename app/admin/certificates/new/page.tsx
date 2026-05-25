"use client";

import { useActionState } from "react";
import { createCertificate } from "../actions";
import { SubmitButton } from "../../_components/SubmitButton";
import Link from "next/link";

const initialState = { error: "" };

export default function NewCertificatePage() {
  const [state, formAction] = useActionState(createCertificate, initialState);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/certificates" className="text-gray-400 hover:text-white text-sm transition">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold">Tambah Sertifikat</h1>
      </div>

      <form action={formAction} className="bg-gray-900 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1.5">
              Nama Sertifikat <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              placeholder="e.g. Associate Data Scientist"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Lembaga Penerbit <span className="text-red-400">*</span>
            </label>
            <input
              name="issuing_org"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              placeholder="e.g. BNSP, Coursera, Dicoding"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">ID / Nomor Sertifikat</label>
            <input
              name="credential_id"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              placeholder="Opsional"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">
              Tanggal Terbit <span className="text-red-400">*</span>
            </label>
            <input
              name="issued_date"
              type="date"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Tanggal Kedaluwarsa</label>
            <input
              name="expiration_date"
              type="date"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition"
            />
            <p className="text-gray-500 text-xs mt-1">Kosongkan jika tidak kedaluwarsa.</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1.5">
              Gambar Sertifikat <span className="text-red-400">*</span>
            </label>
            <input
              name="image_file"
              type="file"
              accept="image/*"
              required
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 file:cursor-pointer file:transition"
            />
            <p className="text-gray-500 text-xs mt-1">
              Format: JPG, PNG, WebP. Akan diunggah ke Supabase Storage.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1.5">URL Verifikasi</label>
            <input
              name="credential_url"
              type="url"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              placeholder="https://... (opsional)"
            />
          </div>
        </div>

        {state?.error && (
          <p className="text-red-400 text-sm">{state.error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <SubmitButton label="Simpan Sertifikat" />
          <Link
            href="/admin/certificates"
            className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm transition"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
