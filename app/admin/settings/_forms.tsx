"use client";

import { useActionState } from "react";
import Image from "next/image";
import { updateProfilePhoto, changePassword } from "./actions";

const photoInitial = { error: "", success: "" };
const passInitial = { error: "", success: "" };

export function ProfilePhotoForm({ currentPhotoUrl }: { currentPhotoUrl: string }) {
  const [state, formAction] = useActionState(updateProfilePhoto, photoInitial);

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-1">Foto Profil</h2>
      <p className="text-gray-400 text-xs mb-5">
        Foto ini akan ditampilkan di halaman utama portofolio.
      </p>

      {/* Current photo preview */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 mb-5">
        <Image
          src={currentPhotoUrl}
          alt="Foto profil saat ini"
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <form action={formAction} className="flex flex-col sm:flex-row gap-3 items-start">
        <input
          key={state.success}
          name="photo"
          type="file"
          accept="image/*"
          required
          className="flex-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 file:cursor-pointer file:transition file:text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition shrink-0"
        >
          Upload Foto
        </button>
      </form>

      {state.error && <p className="text-red-400 text-sm mt-3">{state.error}</p>}
      {state.success && <p className="text-green-400 text-sm mt-3">{state.success}</p>}
    </div>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePassword, passInitial);

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-1">Ganti Password</h2>
      <p className="text-gray-400 text-xs mb-5">
        Masukkan password saat ini untuk verifikasi, lalu isi password baru.
      </p>

      <form action={formAction} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Password Saat Ini</label>
          <input
            name="current_password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Password Baru</label>
          <input
            name="new_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Konfirmasi Password Baru</label>
          <input
            name="confirm_password"
            type="password"
            required
            autoComplete="new-password"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
        {state.success && <p className="text-green-400 text-sm">{state.success}</p>}

        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
        >
          Simpan Password
        </button>
      </form>
    </div>
  );
}
