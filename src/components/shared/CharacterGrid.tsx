"use client";

import { useState } from "react";
import type { CharacterData, CharacterType } from "@/data/korean";
import {
  consonants,
  vowels,
  doubleConsonants,
  compoundVowels,
} from "@/data/korean";
import CharacterCard from "./CharacterCard";
import CharacterDetailModal from "./CharacterDetailModal";

interface Tab {
  key: CharacterType;
  label: string;
  sublabel: string;
  count: number;
  data: CharacterData[];
}

const tabs: Tab[] = [
  {
    key: "basic_consonant",
    label: "基础辅音",
    sublabel: "기본 자음",
    count: 14,
    data: consonants as CharacterData[],
  },
  {
    key: "basic_vowel",
    label: "基础元音",
    sublabel: "기본 모음",
    count: 10,
    data: vowels as CharacterData[],
  },
  {
    key: "double_consonant",
    label: "双辅音",
    sublabel: "쌍자음",
    count: 5,
    data: doubleConsonants as CharacterData[],
  },
  {
    key: "compound_vowel",
    label: "复合元音",
    sublabel: "복합 모음",
    count: 11,
    data: compoundVowels as CharacterData[],
  },
];

// 辅音按发音位置分组
const consonantGroups: { label: string; chars: string[] }[] = [
  { label: "双唇音", chars: ["ㅁ", "ㅂ", "ㅍ"] },
  { label: "齿龈音", chars: ["ㄴ", "ㄷ", "ㅌ", "ㄹ"] },
  { label: "齿龈擦音", chars: ["ㅅ"] },
  { label: "龈腭音", chars: ["ㅈ", "ㅊ"] },
  { label: "软腭音", chars: ["ㄱ", "ㅋ"] },
  { label: "喉音/零声母", chars: ["ㅇ", "ㅎ"] },
];

// 元音按阴阳性分组
const vowelGroups: { label: string; chars: string[] }[] = [
  { label: "阳性元音", chars: ["ㅏ", "ㅑ", "ㅗ", "ㅛ"] },
  { label: "阴性元音", chars: ["ㅓ", "ㅕ", "ㅜ", "ㅠ"] },
  { label: "中性元音", chars: ["ㅡ", "ㅣ"] },
];

export default function CharacterGrid() {
  const [activeTab, setActiveTab] = useState<CharacterType>("basic_consonant");
  const [selectedChar, setSelectedChar] = useState<CharacterData | null>(null);

  const currentTab = tabs.find((t) => t.key === activeTab)!;

  // 获取子分组（辅音按发音位置，元音按阴阳性）
  const subGroups = getSubGroups(activeTab, currentTab.data);

  return (
    <div>
      {/* Tab 切换 */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 text-sm transition-all ${
              activeTab === tab.key
                ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700"
            }`}
          >
            <span className="font-medium">{tab.label}</span>
            <span className="text-[11px] opacity-70">
              {tab.sublabel} · {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 字符网格（按子分组） */}
      {subGroups ? (
        <div className="space-y-6">
          {subGroups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {group.label}
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
                {group.chars.map((char) => (
                  <CharacterCard
                    key={char.id}
                    char={char}
                    onClick={setSelectedChar}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-3 sm:grid-cols-7 md:grid-cols-8">
          {currentTab.data.map((char) => (
            <CharacterCard
              key={char.id}
              char={char}
              onClick={setSelectedChar}
            />
          ))}
        </div>
      )}

      {/* 详情弹窗 */}
      <CharacterDetailModal
        char={selectedChar}
        onClose={() => setSelectedChar(null)}
      />
    </div>
  );
}

function getSubGroups(
  type: CharacterType,
  data: CharacterData[]
): { label: string; chars: CharacterData[] }[] | null {
  const charMap = new Map(data.map((c) => [c.character, c]));

  if (type === "basic_consonant") {
    return consonantGroups.map((g) => ({
      label: g.label,
      chars: g.chars.map((ch) => charMap.get(ch)!).filter(Boolean),
    }));
  }

  if (type === "basic_vowel") {
    return vowelGroups.map((g) => ({
      label: g.label,
      chars: g.chars.map((ch) => charMap.get(ch)!).filter(Boolean),
    }));
  }

  // 双辅音和复合元音数量少，不做子分组
  return null;
}
