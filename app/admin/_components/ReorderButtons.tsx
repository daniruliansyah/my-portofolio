"use client";

import { useTransition } from "react";

interface Props {
  itemId: string;
  isFirst: boolean;
  isLast: boolean;
  moveAction: (id: string, direction: "up" | "down") => Promise<void>;
}

export function ReorderButtons({ itemId, isFirst, isLast, moveAction }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-0.5">
      <button
        onClick={() => !isFirst && startTransition(() => moveAction(itemId, "up"))}
        disabled={isFirst || isPending}
        className="px-2 py-0.5 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 disabled:opacity-25 disabled:cursor-not-allowed transition leading-none"
        title="Pindah ke atas"
      >
        ▲
      </button>
      <button
        onClick={() => !isLast && startTransition(() => moveAction(itemId, "down"))}
        disabled={isLast || isPending}
        className="px-2 py-0.5 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 disabled:opacity-25 disabled:cursor-not-allowed transition leading-none"
        title="Pindah ke bawah"
      >
        ▼
      </button>
    </div>
  );
}
