"use client";

import { useActionState, useTransition } from "react";
import Image from "next/image";
import { SubmitButton } from "./SubmitButton";

type MediaItem = {
  id: string;
  image_url: string;
  caption: string | null;
};

type UploadState = { error: string };

type Props = {
  medias: MediaItem[];
  uploadAction: (prevState: UploadState, formData: FormData) => Promise<UploadState>;
  deleteAction: (mediaId: string) => Promise<void>;
};

function MediaDeleteButton({
  mediaId,
  deleteAction,
}: {
  mediaId: string;
  deleteAction: (id: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        if (!confirm("Hapus gambar ini?")) return;
        startTransition(async () => {
          await deleteAction(mediaId);
        });
      }}
      disabled={isPending}
      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
    >
      {isPending ? "..." : "Hapus"}
    </button>
  );
}

export function MediaSection({ medias, uploadAction, deleteAction }: Props) {
  const [state, formAction] = useActionState(uploadAction, { error: "" });

  return (
    <div className="bg-gray-900 rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold mb-1">Galeri Gambar</h2>
      <p className="text-gray-400 text-xs mb-4">
        {medias.length} gambar tersimpan
      </p>

      {medias.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {medias.map((media) => (
            <div key={media.id} className="relative group">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                <Image
                  src={media.image_url}
                  alt={media.caption ?? "Gambar"}
                  fill
                  className="object-cover"
                />
              </div>
              {media.caption && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {media.caption}
                </p>
              )}
              <MediaDeleteButton mediaId={media.id} deleteAction={deleteAction} />
            </div>
          ))}
        </div>
      )}

      {medias.length === 0 && (
        <p className="text-gray-500 text-sm mb-4">Belum ada gambar ditambahkan.</p>
      )}

      <form action={formAction} className="flex flex-col sm:flex-row gap-3 items-start border-t border-gray-800 pt-4">
        <div className="flex-1 space-y-2">
          <input
            key={state.error}
            name="image"
            type="file"
            accept="image/*"
            required
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600 file:cursor-pointer file:transition file:text-sm"
          />
          <input
            name="caption"
            placeholder="Keterangan gambar (opsional)"
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <SubmitButton label="Upload" />
      </form>

      {state?.error && (
        <p className="text-red-400 text-sm mt-2">{state.error}</p>
      )}
    </div>
  );
}
