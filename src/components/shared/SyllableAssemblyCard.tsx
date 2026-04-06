"use client";

import { useState, useEffect, useRef } from "react";
import type { QuizQuestion, QuizAnswer } from "@/lib/quiz";
import { composeSyllableFromChars } from "@/lib/hangul";

interface SyllableAssemblyCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  timed: boolean;
  onAnswer: (answer: QuizAnswer) => void;
}

export default function SyllableAssemblyCard({
  question,
  questionIndex,
  totalQuestions,
  timed,
  onAnswer,
}: SyllableAssemblyCardProps) {
  const syl = question.syllable!;
  const [initial, setInitial] = useState<string | null>(null);
  const [medial, setMedial] = useState<string | null>(null);
  const [final, setFinal] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    setInitial(null);
    setMedial(null);
    setFinal(null);
    setRevealed(false);
    setCorrect(false);
    startTime.current = Date.now();
  }, [question]);

  const handleConfirm = () => {
    if (initial === null || medial === null || final === null || revealed) return;
    const timeMs = Date.now() - startTime.current;

    const selectedFinal = final === "" ? null : final;
    const isCorrect =
      initial === syl.initial &&
      medial === syl.medial &&
      selectedFinal === syl.final;

    setCorrect(isCorrect);
    setRevealed(true);

    setTimeout(() => {
      const answer = selectedFinal
        ? `${initial}+${medial}+${selectedFinal}`
        : `${initial}+${medial}`;
      onAnswer({
        questionId: question.id,
        selectedAnswer: answer,
        correct: isCorrect,
        timeMs,
      });
    }, 1500);
  };

  // live preview of composed syllable
  const preview =
    initial && medial
      ? composeSyllableFromChars(initial, medial, final === "" ? null : final)
      : null;

  const allSelected = initial !== null && medial !== null && final !== null;
  const progressText =
    totalQuestions > 0
      ? `${questionIndex + 1} / ${totalQuestions}`
      : `第 ${questionIndex + 1} 题`;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6">
      {/* header */}
      <div className="flex w-full items-center justify-between text-xs text-zinc-400">
        <span>{progressText}</span>
        {timed && <Timer />}
      </div>

      {totalQuestions > 0 && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      )}

      {/* target block */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <span className="text-6xl font-bold">{syl.block}</span>
        </div>
        <span className="text-xs text-zinc-400">选择正确的初声 + 中声 + 终声</span>
      </div>

      {/* live preview */}
      <div className="flex h-12 items-center justify-center text-2xl font-medium text-zinc-500">
        {preview ?? "—"}
      </div>

      {/* 初声 row */}
      <Row
        label="初声"
        options={syl.initialOptions}
        selected={initial}
        correct={revealed ? syl.initial : undefined}
        onSelect={revealed ? undefined : setInitial}
      />

      {/* 중성 row */}
      <Row
        label="中声"
        options={syl.medialOptions}
        selected={medial}
        correct={revealed ? syl.medial : undefined}
        onSelect={revealed ? undefined : setMedial}
      />

      {/* 종성 row */}
      <Row
        label="终声"
        options={syl.finalOptions}
        selected={final}
        correct={revealed ? (syl.final ?? "") : undefined}
        onSelect={revealed ? undefined : setFinal}
        showNone
      />

      {/* confirm or feedback */}
      {!revealed ? (
        <button
          type="button"
          disabled={!allSelected}
          onClick={handleConfirm}
          className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
            allSelected
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
        >
          确认
        </button>
      ) : (
        <div className="text-center text-sm">
          {correct ? (
            <span className="text-emerald-600 dark:text-emerald-400">
              正确! {syl.block} = {syl.initial} + {syl.medial}
              {syl.final ? ` + ${syl.final}` : ""}
            </span>
          ) : (
            <span className="text-rose-600 dark:text-rose-400">
              正确答案: {syl.initial} + {syl.medial}
              {syl.final ? ` + ${syl.final}` : ""} → {syl.block}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  options,
  selected,
  correct,
  onSelect,
  showNone,
}: {
  label: string;
  options: string[];
  selected: string | null;
  correct?: string;
  onSelect?: (v: string) => void;
  showNone?: boolean;
}) {
  return (
    <div className="w-full">
      <div className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {options.map((opt) => {
          const display = opt === "" ? "없음" : opt;
          let style =
            "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600";

          if (correct !== undefined) {
            if (opt === correct) {
              style =
                "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-400";
            } else if (opt === selected && opt !== correct) {
              style =
                "border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-600 dark:bg-rose-950 dark:text-rose-400";
            } else {
              style = "border-zinc-200 opacity-40 dark:border-zinc-700";
            }
          } else if (opt === selected) {
            style =
              "border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-950 dark:text-indigo-400";
          }

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect?.(opt)}
              disabled={!onSelect}
              className={`rounded-lg border py-2 text-center text-lg font-medium transition-all ${style}`}
            >
              {display}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Timer() {
  const [elapsed, setElapsed] = useState(0);
  const start = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - start.current), 1000);
    return () => clearInterval(id);
  }, []);

  const secs = Math.floor(elapsed / 1000);
  const mins = Math.floor(secs / 60);
  return (
    <span className="font-mono">
      {String(mins).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
    </span>
  );
}
