"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label = "Simpan" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
    >
      {pending ? "Menyimpan..." : label}
    </button>
  );
}
