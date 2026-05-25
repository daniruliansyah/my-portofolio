"use client";

import { useActionState } from "react";
import { updateCertificate } from "../../actions";
import { SubmitButton } from "../../../_components/SubmitButton";
import Link from "next/link";
import Image from "next/image";
import type { Certificate } from "@prisma/client";

const initialState = { error: "" };

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function EditCertificateForm({ cert }: { cert: Certificate }) {
  const updateWithId = updateCertificate.bind(null, cert.id);
  const [state, formAction] = useActionState(updateWithId, initialState);

  return (
    <form action={formAction} className="bg-gray-900 rounded-xl p-6 space-y-4">
      {/* Hidden: kirim URL gambar lama agar tidak hilang jika tidak upload baru */}
      <input type="hidden" name="existing_image_url" value={cert.image_url} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-300 mb-1.5">
            Nama Sertifikat <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            required
            defaultValue={cert.name}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Lembaga Penerbit <span className="text-red-400">*</span>
          </label>
          <input
            name="issuing_org"
            required
            defaultValue={cert.issuing_org}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">ID / Nomor Sertifikat</label>
          <input
            name="credential_id"
            defaultValue={cert.credential_id ?? ""}
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
            defaultValue={toDateInputValue(cert.issued_date)}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Tanggal Kedaluwarsa</label>
          <input
            name="expiration_date"
            type="date"
            defaultValue={toDateInputValue(cert.expiration_date)}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition"
          />
          <p className="text-gray-500 text-xs mt-1">Kosongkan jika tidak kedaluwarsa.</p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-300 mb-1.5">Ganti Gambar Sertifikat</label>

          {/* Preview gambar saat ini */}
          <div className="mb-3 relative w-48 h-32 rounded-lg overflow-hidden border border-gray-700">
            <Image
              src={cert.image_url}
              alt="Gambar sertifikat saat ini"
              fill
              className="object-cover"
            />
          </div>

          <input
            name="image_file"
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 file:cursor-pointer file:transition"
          />
          <p className="text-gray-500 text-xs mt-1">
            Biarkan kosong jika tidak ingin mengganti gambar. Gambar lama akan dihapus otomatis.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-300 mb-1.5">URL Verifikasi</label>
          <input
            name="credential_url"
            type="url"
            defaultValue={cert.credential_url ?? ""}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="https://... (opsional)"
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-red-400 text-sm">{state.error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label="Perbarui Sertifikat" />
        <Link
          href="/admin/certificates"
          className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm transition"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
