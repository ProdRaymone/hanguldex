import type { CharacterData, CharacterType } from "@/data/korean";
import {
  consonants,
  vowels,
  doubleConsonants,
  compoundVowels,
  allCharacters,
  cvcSyllables,
  cvSyllables,
  batchimRules,
  representativeSounds,
  confusionGroups,
} from "@/data/korean";
import type { SyllableBlock, ConfusionGroup } from "@/data/korean";
import { INITIALS, MEDIALS, FINALS } from "@/lib/hangul";
import type { QuizQuestion, QuizType, QuizSettings, QuizAnswer, QuizResult } from "./types";

// --------------- helpers ---------------

const charPoolMap: Record<CharacterType, CharacterData[]> = {
  basic_consonant: consonants as CharacterData[],
  basic_vowel: vowels as CharacterData[],
  double_consonant: doubleConsonants as CharacterData[],
  compound_vowel: compoundVowels as CharacterData[],
};

function getCharacterPool(types: CharacterType[]): CharacterData[] {
  return types.flatMap((t) => charPoolMap[t] ?? []);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(pool: string[], exclude: string, count: number): string[] {
  const candidates = pool.filter((x) => x !== exclude);
  return shuffle(candidates).slice(0, count);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// A dummy CharacterData for syllable/batchim questions where no single character is "the target"
function makeDummyTarget(char: string, roman: string): CharacterData {
  return {
    id: "__synth__",
    character: char,
    romanization: roman,
    ipa: "",
    type: "basic_consonant",
    audio_url: "",
    stroke_order: [],
    similar_chars: [],
    example_syllable: "",
    example_word: "",
    difficulty: 1,
    group: "",
  };
}

// --------------- per-type generators ---------------

function genCharToRoman(id: number, target: CharacterData, pool: CharacterData[]): QuizQuestion {
  const distractors = pickDistractors(pool.map((c) => c.romanization), target.romanization, 3);
  return {
    id, type: "char_to_roman", target,
    options: shuffle([target.romanization, ...distractors]),
    correctAnswer: target.romanization,
    prompt: target.character,
  };
}

function genListenToChar(id: number, target: CharacterData, pool: CharacterData[]): QuizQuestion {
  const distractors = pickDistractors(pool.map((c) => c.character), target.character, 3);
  return {
    id, type: "listen_to_char", target,
    options: shuffle([target.character, ...distractors]),
    correctAnswer: target.character,
    prompt: target.character,
  };
}

function genRomanToChar(id: number, target: CharacterData, pool: CharacterData[]): QuizQuestion {
  const distractors = pickDistractors(pool.map((c) => c.character), target.character, 3);
  return {
    id, type: "roman_to_char", target,
    options: shuffle([target.character, ...distractors]),
    correctAnswer: target.character,
    prompt: target.romanization,
  };
}

function genSyllableAssembly(id: number): QuizQuestion {
  const pool = [...cvSyllables, ...cvcSyllables];
  const syl = pickRandom(pool);

  const correctInitial = syl.initial;
  const correctMedial = syl.medial;
  const correctFinal = syl.final;

  // build distractor options for each row
  const basicInitials = INITIALS.filter((c) => c !== correctInitial);
  const basicMedials = MEDIALS.filter((c) => c !== correctMedial);
  // finals include "" for no-final
  const allFinals = FINALS.filter((c) => c !== (correctFinal ?? ""));

  const initialOptions = shuffle([correctInitial, ...shuffle(basicInitials).slice(0, 3)]);
  const medialOptions = shuffle([correctMedial, ...shuffle(basicMedials).slice(0, 3)]);
  const finalOptions = shuffle([
    correctFinal ?? "",
    ...shuffle(allFinals).slice(0, 3),
  ]);

  // The "correctAnswer" is the composed string "ㅎ+ㅏ+ㄴ" or "ㄱ+ㅏ"
  const correctAnswer = correctFinal
    ? `${correctInitial}+${correctMedial}+${correctFinal}`
    : `${correctInitial}+${correctMedial}`;

  return {
    id,
    type: "syllable_assembly",
    target: makeDummyTarget(syl.block, syl.romanization),
    options: [],
    correctAnswer,
    prompt: syl.block,
    syllable: {
      block: syl.block,
      initial: correctInitial,
      medial: correctMedial,
      final: correctFinal,
      initialOptions,
      medialOptions,
      finalOptions,
    },
  };
}

function genBatchimIdentify(id: number): QuizQuestion {
  const syl = pickRandom(cvcSyllables);
  const finalChar = syl.final!;
  const rule = batchimRules.find((r) => r.batchim === finalChar);
  const representative = rule ? rule.representative : finalChar;

  const distractors = pickDistractors(representativeSounds, representative, 3);
  const options = shuffle([representative, ...distractors]);

  return {
    id,
    type: "batchim_identify",
    target: makeDummyTarget(syl.block, syl.romanization),
    options,
    correctAnswer: representative,
    prompt: syl.block,
    batchim: {
      syllable: syl.block,
      batchimChar: finalChar,
      representative,
    },
  };
}

function genConfusionPairs(
  id: number,
  group: ConfusionGroup,
  allChars: CharacterData[],
): QuizQuestion {
  // pick a target character from the group
  const targetChar = pickRandom(group.characters);
  const target = allChars.find((c) => c.character === targetChar);
  if (!target) return genCharToRoman(id, pickRandom(allChars), allChars);

  // alternate between char→roman and roman→char
  const mode = Math.random() < 0.5 ? "char_to_roman" : "roman_to_char";

  // use the group characters + maybe 1 extra as distractors
  const groupChars = allChars.filter((c) => group.characters.includes(c.character));

  if (mode === "char_to_roman") {
    const others = groupChars.filter((c) => c.romanization !== target.romanization);
    const distractors = shuffle(others.map((c) => c.romanization)).slice(0, 3);
    // pad if fewer than 3
    while (distractors.length < 3) {
      const extra = pickRandom(allChars);
      if (extra.romanization !== target.romanization && !distractors.includes(extra.romanization)) {
        distractors.push(extra.romanization);
      }
    }
    return {
      id, type: "confusion_pairs", target,
      options: shuffle([target.romanization, ...distractors.slice(0, 3)]),
      correctAnswer: target.romanization,
      prompt: target.character,
    };
  } else {
    const others = groupChars.filter((c) => c.character !== target.character);
    const distractors = shuffle(others.map((c) => c.character)).slice(0, 3);
    while (distractors.length < 3) {
      const extra = pickRandom(allChars);
      if (extra.character !== target.character && !distractors.includes(extra.character)) {
        distractors.push(extra.character);
      }
    }
    return {
      id, type: "confusion_pairs", target,
      options: shuffle([target.character, ...distractors.slice(0, 3)]),
      correctAnswer: target.character,
      prompt: target.romanization,
    };
  }
}

// --------------- main API ---------------

function generateQuestion(
  id: number,
  type: QuizType,
  target: CharacterData,
  pool: CharacterData[],
  settings: QuizSettings,
): QuizQuestion {
  switch (type) {
    case "char_to_roman":
      return genCharToRoman(id, target, pool);
    case "listen_to_char":
      return genListenToChar(id, target, pool);
    case "roman_to_char":
      return genRomanToChar(id, target, pool);
    case "syllable_assembly":
      return genSyllableAssembly(id);
    case "batchim_identify":
      return genBatchimIdentify(id);
    case "confusion_pairs": {
      const groupIds = settings.confusionGroupIds ?? [];
      const groups = groupIds.length > 0
        ? confusionGroups.filter((g) => groupIds.includes(g.id))
        : confusionGroups;
      const group = pickRandom(groups.length > 0 ? groups : confusionGroups);
      return genConfusionPairs(id, group, allCharacters);
    }
  }
}

export function generateQuiz(settings: QuizSettings): QuizQuestion[] {
  const pool = getCharacterPool(settings.characterTypes);
  const needsCharPool = settings.quizTypes.some((t) =>
    ["char_to_roman", "listen_to_char", "roman_to_char", "confusion_pairs"].includes(t),
  );
  if (needsCharPool && pool.length === 0 &&
    !settings.quizTypes.every((t) => ["syllable_assembly", "batchim_identify"].includes(t))
  ) {
    // fallback: use all chars
    pool.push(...allCharacters);
  }

  const count = settings.questionCount > 0 ? settings.questionCount : Math.max(pool.length, 10);
  const questions: QuizQuestion[] = [];

  let charQueue = shuffle(pool);
  const typeQueue = [...settings.quizTypes];

  for (let i = 0; i < count; i++) {
    if (charQueue.length === 0) charQueue = shuffle(pool);
    const type = typeQueue[i % typeQueue.length];
    const target = charQueue.length > 0 ? charQueue.pop()! : pickRandom(allCharacters);
    questions.push(generateQuestion(i, type, target, pool.length > 0 ? pool : allCharacters, settings));
  }

  return questions;
}

export function calculateResult(
  questions: QuizQuestion[],
  answers: QuizAnswer[],
): QuizResult {
  const correctCount = answers.filter((a) => a.correct).length;
  const totalTimeMs = answers.reduce((sum, a) => sum + a.timeMs, 0);

  const wrongQuestions = answers
    .filter((a) => !a.correct)
    .map((a) => {
      const question = questions.find((q) => q.id === a.questionId)!;
      return { question, selectedAnswer: a.selectedAnswer };
    });

  return {
    answers,
    totalQuestions: questions.length,
    correctCount,
    accuracy: questions.length > 0 ? correctCount / questions.length : 0,
    totalTimeMs,
    wrongQuestions,
  };
}
