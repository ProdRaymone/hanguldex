import type { CharacterData, CharacterType } from "@/data/korean";

export type QuizType =
  | "char_to_roman"
  | "listen_to_char"
  | "roman_to_char"
  | "syllable_assembly"
  | "batchim_identify"
  | "confusion_pairs";

export interface QuizSettings {
  characterTypes: CharacterType[];
  quizTypes: QuizType[];
  questionCount: number; // 0 = unlimited
  timed: boolean;
  /** 选中的易混淆组 ID 列表（仅 confusion_pairs 模式使用） */
  confusionGroupIds?: string[];
}

export interface QuizQuestion {
  id: number;
  type: QuizType;
  /** 出题的目标字符 */
  target: CharacterData;
  /** 4 个选项 */
  options: string[];
  /** 正确答案在 options 中的内容 */
  correctAnswer: string;
  /** 题面展示内容 — 字符 or 罗马音 */
  prompt: string;
  /** Type D: 音节组装数据 */
  syllable?: {
    block: string;
    initial: string;
    medial: string;
    final: string | null;
    initialOptions: string[];
    medialOptions: string[];
    finalOptions: string[];
  };
  /** Type E: 收音识别数据 */
  batchim?: {
    syllable: string;
    batchimChar: string;
    representative: string;
  };
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: string;
  correct: boolean;
  timeMs: number;
}

export interface QuizResult {
  answers: QuizAnswer[];
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  totalTimeMs: number;
  /** 答错的题目及其正确答案，用于错题回顾 */
  wrongQuestions: {
    question: QuizQuestion;
    selectedAnswer: string;
  }[];
}

export const defaultSettings: QuizSettings = {
  characterTypes: ["basic_consonant", "basic_vowel"],
  quizTypes: ["char_to_roman"],
  questionCount: 10,
  timed: false,
};

export const quizTypeLabels: Record<QuizType, { label: string; desc: string }> = {
  char_to_roman: { label: "Type A 看字选音", desc: "看到韩文字母，选择对应罗马音" },
  listen_to_char: { label: "Type B 听音识字", desc: "听发音，选择对应字符" },
  roman_to_char: { label: "Type C 看音选字", desc: "看到罗马音，选择对应字符" },
  syllable_assembly: { label: "Type D 音节组装", desc: "看到音节块，选择正确的初声+中声+终声" },
  batchim_identify: { label: "Type E 收音识别", desc: "看到含收音的音节，识别发音代表音" },
  confusion_pairs: { label: "易混淆专练", desc: "聚焦 2-3 个易混淆字符快速辨别" },
};

export const questionCountOptions = [
  { value: 10, label: "10 题" },
  { value: 20, label: "20 题" },
  { value: 50, label: "50 题" },
  { value: 0, label: "无限" },
];
