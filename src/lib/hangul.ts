/**
 * Korean syllable composition / decomposition utilities.
 * Based on the Unicode Hangul Syllables block (U+AC00 – U+D7A3).
 */

const HANGUL_BASE = 0xac00;
const MEDIAL_COUNT = 21;
const FINAL_COUNT = 28;

/** 초성 (initial consonants) in Unicode order */
export const INITIALS = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ",
  "ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",
] as const;

/** 중성 (medial vowels) in Unicode order */
export const MEDIALS = [
  "ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ",
  "ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ",
] as const;

/** 종성 (final consonants) in Unicode order — index 0 = no final */
export const FINALS = [
  "","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ",
  "ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ",
  "ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",
] as const;

/** Compose a Hangul syllable block from jamo indices */
export function composeSyllable(
  initialIdx: number,
  medialIdx: number,
  finalIdx: number = 0,
): string {
  return String.fromCharCode(
    HANGUL_BASE + (initialIdx * MEDIAL_COUNT + medialIdx) * FINAL_COUNT + finalIdx,
  );
}

/** Compose from jamo characters */
export function composeSyllableFromChars(
  initial: string,
  medial: string,
  final: string | null = null,
): string | null {
  const i = INITIALS.indexOf(initial as typeof INITIALS[number]);
  const m = MEDIALS.indexOf(medial as typeof MEDIALS[number]);
  const f = final ? FINALS.indexOf(final as typeof FINALS[number]) : 0;
  if (i === -1 || m === -1 || f === -1) return null;
  return composeSyllable(i, m, f);
}

export interface DecomposedSyllable {
  initial: string;
  medial: string;
  final: string | null;
}

/** Decompose a Hangul syllable block into jamo */
export function decomposeSyllable(char: string): DecomposedSyllable | null {
  const code = char.charCodeAt(0) - HANGUL_BASE;
  if (code < 0 || code > 11171) return null;

  const finalIdx = code % FINAL_COUNT;
  const medialIdx = ((code - finalIdx) / FINAL_COUNT) % MEDIAL_COUNT;
  const initialIdx = Math.floor((code - finalIdx) / FINAL_COUNT / MEDIAL_COUNT);

  return {
    initial: INITIALS[initialIdx],
    medial: MEDIALS[medialIdx],
    final: finalIdx === 0 ? null : FINALS[finalIdx],
  };
}

/** Initial-consonant romanization (onset position) */
export const INITIAL_ROMAN: Record<string, string> = {
  ㄱ:"g",ㄲ:"kk",ㄴ:"n",ㄷ:"d",ㄸ:"tt",ㄹ:"r",ㅁ:"m",ㅂ:"b",ㅃ:"pp",
  ㅅ:"s",ㅆ:"ss",ㅇ:"",ㅈ:"j",ㅉ:"jj",ㅊ:"ch",ㅋ:"k",ㅌ:"t",ㅍ:"p",ㅎ:"h",
};

/** Medial-vowel romanization */
export const MEDIAL_ROMAN: Record<string, string> = {
  ㅏ:"a",ㅐ:"ae",ㅑ:"ya",ㅒ:"yae",ㅓ:"eo",ㅔ:"e",ㅕ:"yeo",ㅖ:"ye",
  ㅗ:"o",ㅘ:"wa",ㅙ:"wae",ㅚ:"oe",ㅛ:"yo",ㅜ:"u",ㅝ:"wo",ㅞ:"we",
  ㅟ:"wi",ㅠ:"yu",ㅡ:"eu",ㅢ:"ui",ㅣ:"i",
};

/** Final-consonant romanization (coda position) */
export const FINAL_ROMAN: Record<string, string> = {
  ㄱ:"k",ㄲ:"k",ㄳ:"k",ㄴ:"n",ㄵ:"n",ㄶ:"n",ㄷ:"t",ㄹ:"l",ㄺ:"k",ㄻ:"m",
  ㄼ:"l",ㄽ:"l",ㄾ:"l",ㄿ:"p",ㅀ:"l",ㅁ:"m",ㅂ:"p",ㅄ:"p",ㅅ:"t",ㅆ:"t",
  ㅇ:"ng",ㅈ:"t",ㅊ:"t",ㅋ:"k",ㅌ:"t",ㅍ:"p",ㅎ:"t",
};

/** Build romanization for a syllable block string */
export function romanizeSyllable(block: string): string {
  const d = decomposeSyllable(block);
  if (!d) return "";
  let r = INITIAL_ROMAN[d.initial] ?? "";
  r += MEDIAL_ROMAN[d.medial] ?? "";
  if (d.final) r += FINAL_ROMAN[d.final] ?? "";
  return r;
}
