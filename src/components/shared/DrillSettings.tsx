"use client";

import type { CharacterType } from "@/data/korean";
import { confusionGroups } from "@/data/korean";
import type { QuizSettings, QuizType } from "@/lib/quiz";
import { quizTypeLabels, questionCountOptions } from "@/lib/quiz";

interface DrillSettingsProps {
  settings: QuizSettings;
  onChange: (settings: QuizSettings) => void;
  onStart: () => void;
}

const charTypeOptions: { key: CharacterType; label: string; count: number }[] = [
  { key: "basic_consonant", label: "基础辅音", count: 14 },
  { key: "basic_vowel", label: "基础元音", count: 10 },
  { key: "double_consonant", label: "双辅音", count: 5 },
  { key: "compound_vowel", label: "复合元音", count: 11 },
];

/** Types that need character-type selection vs standalone types */
const charDependentTypes: QuizType[] = [
  "char_to_roman", "listen_to_char", "roman_to_char", "confusion_pairs",
];

export default function DrillSettings({ settings, onChange, onStart }: DrillSettingsProps) {
  const toggleCharType = (type: CharacterType) => {
    const types = settings.characterTypes.includes(type)
      ? settings.characterTypes.filter((t) => t !== type)
      : [...settings.characterTypes, type];
    if (types.length > 0) onChange({ ...settings, characterTypes: types });
  };

  const toggleQuizType = (type: QuizType) => {
    const types = settings.quizTypes.includes(type)
      ? settings.quizTypes.filter((t) => t !== type)
      : [...settings.quizTypes, type];
    if (types.length > 0) onChange({ ...settings, quizTypes: types });
  };

  const toggleConfusionGroup = (id: string) => {
    const ids = settings.confusionGroupIds ?? [];
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    onChange({ ...settings, confusionGroupIds: next });
  };

  const showCharTypes = settings.quizTypes.some((t) => charDependentTypes.includes(t));
  const showConfusionGroups = settings.quizTypes.includes("confusion_pairs");

  return (
    <div className="mx-auto max-w-lg space-y-8">
      {/* 题目类型 */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          题目类型
        </h3>
        <div className="space-y-2">
          {(Object.entries(quizTypeLabels) as [QuizType, { label: string; desc: string }][]).map(
            ([type, info]) => {
              const active = settings.quizTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleQuizType(type)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                    active
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="font-medium">{info.label}</div>
                  <div className="text-xs opacity-60">{info.desc}</div>
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* 字符范围 — only for char-based types */}
      {showCharTypes && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            字符范围
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {charTypeOptions.map((opt) => {
              const active = settings.characterTypes.includes(opt.key);
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => toggleCharType(opt.key)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                    active
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <span className="font-medium">{opt.label}</span>
                  <span className="ml-1 text-xs opacity-60">{opt.count}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 易混淆组选择 — only when confusion_pairs is active */}
      {showConfusionGroups && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            易混淆组（不选则全部随机）
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {confusionGroups.map((g) => {
              const active = (settings.confusionGroupIds ?? []).includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleConfusionGroup(g.id)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                    active
                      ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs opacity-60">{g.description}</div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 题数 */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          每轮题数
        </h3>
        <div className="flex gap-2">
          {questionCountOptions.map((opt) => {
            const active = settings.questionCount === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...settings, questionCount: opt.value })}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all ${
                  active
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 计时 */}
      <section>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={settings.timed}
            onChange={(e) => onChange({ ...settings, timed: e.target.checked })}
            className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">启用计时</span>
        </label>
      </section>

      {/* 开始按钮 */}
      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
      >
        开始刷题
      </button>
    </div>
  );
}
