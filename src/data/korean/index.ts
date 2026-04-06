import consonants from "./consonants.json";
import vowels from "./vowels.json";
import doubleConsonants from "./double-consonants.json";
import compoundVowels from "./compound-vowels.json";
import syllableBlocksData from "./syllable-blocks.json";
import batchimRulesData from "./batchim-rules.json";
import confusionPairsData from "./confusion-pairs.json";

export type CharacterType =
  | "basic_consonant"
  | "basic_vowel"
  | "double_consonant"
  | "compound_vowel";

export interface CharacterData {
  id: string;
  character: string;
  name?: string;
  romanization: string;
  ipa: string;
  type: CharacterType;
  audio_url: string;
  stroke_order: number[];
  similar_chars: string[];
  example_syllable: string;
  example_word: string;
  difficulty: number;
  group: string;
  base_consonant?: string;
  composition?: string[];
}

export interface SyllableBlock {
  id: string;
  block: string;
  initial: string;
  medial: string;
  final: string | null;
  romanization: string;
  structure: "CV" | "CVC";
  difficulty: number;
}

export interface BatchimRule {
  batchim: string;
  representative: string;
  pronunciation: string;
  example: string;
  type: "single" | "double";
}

export interface ConfusionGroup {
  id: string;
  name: string;
  category: "visual" | "phonetic" | "tense_aspirated";
  description: string;
  characters: string[];
  difficulty: number;
}

export { consonants, vowels, doubleConsonants, compoundVowels };

export const allCharacters: CharacterData[] = [
  ...(consonants as CharacterData[]),
  ...(vowels as CharacterData[]),
  ...(doubleConsonants as CharacterData[]),
  ...(compoundVowels as CharacterData[]),
];

export const syllableBlocks = syllableBlocksData as SyllableBlock[];
export const cvSyllables = syllableBlocks.filter((s) => s.structure === "CV");
export const cvcSyllables = syllableBlocks.filter((s) => s.structure === "CVC");

export const batchimRules = batchimRulesData.rules as BatchimRule[];
export const representativeSounds = batchimRulesData.representativeSounds as string[];

export const confusionGroups = confusionPairsData.groups as ConfusionGroup[];
