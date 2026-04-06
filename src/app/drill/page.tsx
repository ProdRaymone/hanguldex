"use client";

import { useState, useCallback, useEffect } from "react";
import DrillSettings from "@/components/shared/DrillSettings";
import QuizCard from "@/components/shared/QuizCard";
import QuizResult from "@/components/shared/QuizResult";
import SyllableAssemblyCard from "@/components/shared/SyllableAssemblyCard";
import {
  generateQuiz,
  calculateResult,
  defaultSettings,
} from "@/lib/quiz";
import type {
  QuizSettings,
  QuizQuestion,
  QuizAnswer,
  QuizResult as QuizResultType,
} from "@/lib/quiz";
import { loadSettings, saveSettings, appendHistory } from "@/lib/storage";

type Phase = "settings" | "quiz" | "result";

export default function DrillPage() {
  const [phase, setPhase] = useState<Phase>("settings");
  const [settings, setSettings] = useState<QuizSettings>(defaultSettings);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<QuizResultType | null>(null);

  // Load persisted settings on mount
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const handleSettingsChange = useCallback((s: QuizSettings) => {
    setSettings(s);
    saveSettings(s);
  }, []);

  const finishQuiz = useCallback(
    (qs: QuizQuestion[], ans: QuizAnswer[]) => {
      const r = calculateResult(qs, ans);
      setResult(r);
      setPhase("result");
      appendHistory(r, settings.quizTypes);
    },
    [settings.quizTypes]
  );

  const handleStart = useCallback(() => {
    const qs = generateQuiz(settings);
    if (qs.length === 0) return;
    setQuestions(qs);
    setAnswers([]);
    setCurrentIndex(0);
    setResult(null);
    setPhase("quiz");
  }, [settings]);

  const handleAnswer = useCallback(
    (answer: QuizAnswer) => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      const nextIndex = currentIndex + 1;
      const isUnlimited = settings.questionCount === 0;

      if (!isUnlimited && nextIndex >= questions.length) {
        finishQuiz(questions, newAnswers);
      } else if (isUnlimited && nextIndex >= questions.length) {
        const moreQs = generateQuiz(settings);
        setQuestions((prev) => [...prev, ...moreQs]);
        setCurrentIndex(nextIndex);
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [answers, currentIndex, questions, settings, finishQuiz]
  );

  const handleQuit = useCallback(() => {
    if (answers.length > 0) {
      finishQuiz(questions.slice(0, answers.length), answers);
    } else {
      setPhase("settings");
    }
  }, [answers, questions, finishQuiz]);

  const handleRetry = useCallback(() => {
    handleStart();
  }, [handleStart]);

  const handleBack = useCallback(() => {
    setPhase("settings");
    setResult(null);
  }, []);

  const currentQuestion = questions[currentIndex];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
        刷题练习
      </h2>

      {phase === "settings" && (
        <DrillSettings
          settings={settings}
          onChange={handleSettingsChange}
          onStart={handleStart}
        />
      )}

      {phase === "quiz" && currentQuestion && (
        <div className="space-y-6">
          {currentQuestion.type === "syllable_assembly" ? (
            <SyllableAssemblyCard
              question={currentQuestion}
              questionIndex={currentIndex}
              totalQuestions={settings.questionCount}
              timed={settings.timed}
              onAnswer={handleAnswer}
            />
          ) : (
            <QuizCard
              question={currentQuestion}
              questionIndex={currentIndex}
              totalQuestions={settings.questionCount}
              timed={settings.timed}
              onAnswer={handleAnswer}
            />
          )}
          {settings.questionCount === 0 && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleQuit}
                className="text-sm text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline dark:hover:text-zinc-300"
              >
                结束本轮（已答 {answers.length} 题）
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "result" && result && (
        <QuizResult
          result={result}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
