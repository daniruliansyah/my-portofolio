"use client";

import { useTransition } from "react";

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm("Yakin ingin menghapus data ini?")) return;
        startTransition(async () => {
          await action();
        });
      }}
      disabled={isPending}
      className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50 transition"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}
