"use client";

import { useActionState, useTransition } from "react";
import Image from "next/image";
import { SubmitButton } from "./SubmitButton";

type MediaItem = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

type UploadState = { error: string };

type Props = {
  medias: MediaItem[];
  uploadAction: (prevState: UploadState, formData: FormData) => Promise<UploadState>;
  deleteAction: (mediaId: string) => Promise<void>;
  setCoverAction?: (mediaId: string) => Promise<void>;
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

function SetCoverButton({
  mediaId,
  setCoverAction,
}: {
  mediaId: string;
  setCoverAction: (id: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await setCoverAction(mediaId);
        });
      }}
      disabled={isPending}
      className="absolute bottom-1 left-1 bg-black/70 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
    >
      {isPending ? "..." : "★ Cover"}
    </button>
  );
}

export function MediaSection({ medias, uploadAction, deleteAction, setCoverAction }: Props) {
  const [state, formAction] = useActionState(uploadAction, { error: "" });

  const coverIndex = setCoverAction
    ? medias.findIndex((m) => m.sort_order < 0)
    : -1;
  const effectiveCoverIndex = coverIndex >= 0 ? coverIndex : 0;

  return (
    <div className="bg-gray-900 rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold mb-1">Galeri Gambar</h2>
      <p className="text-gray-400 text-xs mb-4">
        {medias.length} gambar tersimpan
        {setCoverAction && medias.length > 0 && (
          <span className="ml-2 text-gray-500">
            — gambar ber-badge <span className="text-yellow-400">★ Cover</span> tampil sebagai thumbnail di halaman utama
          </span>
        )}
      </p>

      {medias.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {medias.map((media, index) => {
            const isCover = setCoverAction && index === effectiveCoverIndex;
            return (
              <div key={media.id} className="relative group">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                  <Image
                    src={media.image_url}
                    alt={media.caption ?? "Gambar"}
                    fill
                    className="object-cover"
                  />

                  {/* Cover badge */}
                  {isCover && (
                    <div className="absolute top-1 left-1 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                      ★ Cover
                    </div>
                  )}

                  {/* Set as cover button (non-cover items only) */}
                  {setCoverAction && !isCover && (
                    <SetCoverButton mediaId={media.id} setCoverAction={setCoverAction} />
                  )}

                  <MediaDeleteButton mediaId={media.id} deleteAction={deleteAction} />
                </div>

                {media.caption && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{media.caption}</p>
                )}
              </div>
            );
          })}
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
