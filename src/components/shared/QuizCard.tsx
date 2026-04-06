"use client";

import { useState, useEffect, useRef } from "react";
import type { QuizQuestion, QuizAnswer } from "@/lib/quiz";
import { playCharacterAudio } from "@/lib/audio";

interface QuizCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number; // 0 = unlimited
  timed: boolean;
  onAnswer: (answer: QuizAnswer) => void;
}

export default function QuizCard({
  question,
  questionIndex,
  totalQuestions,
  timed,
  onAnswer,
}: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const startTime = useRef(Date.now());

  // 重置状态
  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    startTime.current = Date.now();

    // Type B: 自动播放音频
    if (question.type === "listen_to_char") {
      playCharacterAudio(question.target.character, question.target.audio_url);
    }
  }, [question]);

  const handleSelect = (option: string) => {
    if (selected) return; // 已选则忽略
    const timeMs = Date.now() - startTime.current;
    const correct = option === question.correctAnswer;

    setSelected(option);
    setRevealed(true);

    // 播放正确字符发音
    playCharacterAudio(question.target.character, question.target.audio_url);

    // 延迟后提交答案进入下一题
    setTimeout(() => {
      onAnswer({
        questionId: question.id,
        selectedAnswer: option,
        correct,
        timeMs,
      });
    }, 1200);
  };

  const handleReplay = () => {
    playCharacterAudio(question.target.character, question.target.audio_url);
  };

  const progressText =
    totalQuestions > 0
      ? `${questionIndex + 1} / ${totalQuestions}`
      : `第 ${questionIndex + 1} 题`;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
      {/* 进度 */}
      <div className="flex w-full items-center justify-between text-xs text-zinc-400">
        <span>{progressText}</span>
        {timed && <Timer />}
      </div>

      {/* 进度条 */}
      {totalQuestions > 0 && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      )}

      {/* 题面 */}
      <div className="flex flex-col items-center gap-3">
        {question.type === "listen_to_char" ? (
          <button
            type="button"
            onClick={handleReplay}
            className="flex h-28 w-28 items-center justify-center rounded-2xl bg-indigo-50 transition-colors hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900"
          >
            <svg className="h-12 w-12 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </button>
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            <span
              className={`font-bold ${
                question.type === "char_to_roman" || question.type === "batchim_identify"
                  ? "text-6xl"
                  : question.type === "confusion_pairs"
                    ? "text-5xl"
                    : "text-2xl"
              }`}
            >
              {question.prompt}
            </span>
          </div>
        )}
        <span className="text-xs text-zinc-400">
          {question.type === "listen_to_char"
            ? "点击播放发音，选择对应字符"
            : question.type === "char_to_roman"
              ? "选择对应的罗马音"
              : question.type === "batchim_identify"
                ? "选择该收音的发音代表音"
                : question.type === "confusion_pairs"
                  ? "辨别易混淆字符"
                  : "选择对应的字符"}
        </span>
      </div>

      {/* 选项 */}
      <div className="grid w-full grid-cols-2 gap-3">
        {question.options.map((option) => {
          let style = "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600";

          if (revealed) {
            if (option === question.correctAnswer) {
              style =
                "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-400";
            } else if (option === selected) {
              style =
                "border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-600 dark:bg-rose-950 dark:text-rose-400";
            } else {
              style = "border-zinc-200 opacity-40 dark:border-zinc-700";
            }
          }

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`rounded-xl border px-4 py-4 text-center font-medium transition-all ${style} ${
                question.type === "char_to_roman" ? "text-base" : "text-2xl"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* 反馈 */}
      {revealed && (
        <div className="text-center text-sm">
          {selected === question.correctAnswer ? (
            <span className="text-emerald-600 dark:text-emerald-400">
              正确!
            </span>
          ) : (
            <span className="text-rose-600 dark:text-rose-400">
              {question.batchim
                ? `正确答案: ${question.batchim.batchimChar} → [${question.correctAnswer}]`
                : `正确答案: ${question.correctAnswer}（${question.target.character} = ${question.target.romanization}）`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Timer() {
  const [elapsed, setElapsed] = useState(0);
  const start = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Date.now() - start.current);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const secs = Math.floor(elapsed / 1000);
  const mins = Math.floor(secs / 60);
  const display = `${String(mins).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  return <span className="font-mono">{display}</span>;
}
