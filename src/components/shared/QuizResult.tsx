"use client";

import type { QuizResult as QuizResultType } from "@/lib/quiz";

interface QuizResultProps {
  result: QuizResultType;
  onRetry: () => void;
  onBack: () => void;
}

export default function QuizResult({ result, onRetry, onBack }: QuizResultProps) {
  const accuracyPct = Math.round(result.accuracy * 100);
  const totalSecs = Math.round(result.totalTimeMs / 1000);
  const avgSecs = result.totalQuestions > 0
    ? (result.totalTimeMs / result.totalQuestions / 1000).toFixed(1)
    : "0";

  return (
    <div className="mx-auto max-w-lg space-y-8">
      {/* 总览 */}
      <div className="text-center">
        <div
          className={`text-6xl font-bold ${
            accuracyPct >= 80
              ? "text-emerald-600 dark:text-emerald-400"
              : accuracyPct >= 50
                ? "text-amber-600 dark:text-amber-400"
                : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {accuracyPct}%
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">正确率</p>
      </div>

      {/* 统计卡 */}
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <StatCard label="正确" value={`${result.correctCount}/${result.totalQuestions}`} />
        <StatCard label="总用时" value={formatTime(totalSecs)} />
        <StatCard label="平均用时" value={`${avgSecs}s`} />
      </div>

      {/* 错题回顾 */}
      {result.wrongQuestions.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            错题回顾（{result.wrongQuestions.length} 题）
          </h3>
          <div className="space-y-2">
            {result.wrongQuestions.map(({ question, selectedAnswer }, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{question.target.character}</span>
                  <div>
                    <div className="text-zinc-500 dark:text-zinc-400">
                      {question.target.romanization} · {question.target.ipa}
                    </div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500">
                      {question.target.example_word}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-rose-500">
                    你选: {selectedAnswer}
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400">
                    正确: {question.correctAnswer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          返回设置
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          再来一轮
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 py-3 dark:bg-zinc-900">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-zinc-400">{label}</div>
    </div>
  );
}

function formatTime(secs: number): string {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m${s}s`;
}
