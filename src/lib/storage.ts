import type { QuizSettings, QuizResult } from "@/lib/quiz";
import { defaultSettings } from "@/lib/quiz";

const KEYS = {
  settings: "hanguldex-drill-settings",
  history: "hanguldex-drill-history",
} as const;

// ---- Settings ----

export function loadSettings(): QuizSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: QuizSettings): void {
  try {
    localStorage.setItem(KEYS.settings, JSON.stringify(settings));
  } catch { /* quota exceeded — silently ignore */ }
}

// ---- Drill history ----

export interface DrillRecord {
  timestamp: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  totalTimeMs: number;
  quizTypes: string[];
}

export function loadHistory(): DrillRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.history);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function appendHistory(result: QuizResult, quizTypes: string[]): void {
  try {
    const history = loadHistory();
    history.push({
      timestamp: Date.now(),
      totalQuestions: result.totalQuestions,
      correctCount: result.correctCount,
      accuracy: result.accuracy,
      totalTimeMs: result.totalTimeMs,
      quizTypes,
    });
    // Keep last 100 records
    const trimmed = history.slice(-100);
    localStorage.setItem(KEYS.history, JSON.stringify(trimmed));
  } catch { /* silently ignore */ }
}
