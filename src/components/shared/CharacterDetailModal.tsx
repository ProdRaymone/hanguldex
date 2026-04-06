"use client";

import { useEffect, useCallback } from "react";
import type { CharacterData } from "@/data/korean";
import { playCharacterAudio } from "@/lib/audio";

interface CharacterDetailModalProps {
  char: CharacterData | null;
  onClose: () => void;
}

const typeLabels: Record<string, string> = {
  basic_consonant: "基础辅音",
  basic_vowel: "基础元音",
  double_consonant: "双辅音",
  compound_vowel: "复合元音",
};

export default function CharacterDetailModal({
  char,
  onClose,
}: CharacterDetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!char) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <span className="rounded-lg bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
            {typeLabels[char.type] ?? char.type}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Character display */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="text-7xl font-bold">{char.character}</span>
          {char.name && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {char.name}
            </span>
          )}
          <button
            type="button"
            onClick={() => playCharacterAudio(char.character, char.audio_url)}
            className="mt-2 flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
            播放发音
          </button>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoItem label="罗马音" value={char.romanization} />
          <InfoItem label="IPA" value={char.ipa} />
          <InfoItem label="示例音节" value={char.example_syllable} />
          <InfoItem label="难度" value={`${char.difficulty} / 5`} />
          <div className="col-span-2">
            <InfoItem label="示例词汇" value={char.example_word} />
          </div>
          {char.similar_chars.length > 0 && (
            <div className="col-span-2">
              <InfoItem
                label="易混淆字符"
                value={char.similar_chars.join("  ")}
              />
            </div>
          )}
          {char.composition && (
            <div className="col-span-2">
              <InfoItem
                label="组成"
                value={char.composition.join(" + ")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
      <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
        {label}
      </div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
