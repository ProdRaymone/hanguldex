"use client";

import type { CharacterData } from "@/data/korean";
import { playCharacterAudio } from "@/lib/audio";

interface CharacterCardProps {
  char: CharacterData;
  onClick: (char: CharacterData) => void;
}

const difficultyColors: Record<number, string> = {
  1: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  2: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  3: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  4: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  5: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
};

export default function CharacterCard({ char, onClick }: CharacterCardProps) {
  const handleClick = () => {
    playCharacterAudio(char.character, char.audio_url);
    onClick(char);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex flex-col items-center gap-1 rounded-xl border border-zinc-200 bg-white p-3 transition-all hover:border-indigo-300 hover:shadow-md active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
    >
      <span className="text-2xl font-semibold transition-transform group-hover:scale-110 sm:text-3xl">
        {char.character}
      </span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        {char.romanization}
      </span>
      <span
        className={`mt-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${difficultyColors[char.difficulty] ?? difficultyColors[1]}`}
      >
        Lv.{char.difficulty}
      </span>
    </button>
  );
}
