/**
 * Korean pronunciation audio utility
 *
 * Primary: Google Translate TTS (natural-sounding ko voice)
 * Fallback: Web Speech API SpeechSynthesis (prefers female / Yuna voice)
 */

let currentAudio: HTMLAudioElement | null = null;

// ---- Google Translate TTS ----

function buildGoogleTtsUrl(text: string): string {
  return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ko&q=${encodeURIComponent(text)}`;
}

function playWithGoogleTts(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Stop any previous playback
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    const audio = new Audio(buildGoogleTtsUrl(text));
    currentAudio = audio;

    audio.onended = () => {
      currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      currentAudio = null;
      reject(new Error("Google TTS failed"));
    };

    audio.play().catch(reject);
  });
}

// ---- SpeechSynthesis fallback ----

let cachedVoice: SpeechSynthesisVoice | null = null;
let voiceResolved = false;

function resolveKoreanVoice(): SpeechSynthesisVoice | null {
  if (voiceResolved) return cachedVoice;
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  const korean = voices.filter(
    (v) => v.lang === "ko-KR" || v.lang.startsWith("ko"),
  );

  // Prefer female / Yuna voices for more natural sound
  cachedVoice =
    korean.find((v) => /yuna/i.test(v.name)) ??
    korean.find((v) => /female/i.test(v.name)) ??
    korean.find((v) => v.lang === "ko-KR" && !v.localService) ??
    korean.find((v) => v.lang === "ko-KR") ??
    korean[0] ??
    null;

  if (voices.length > 0) voiceResolved = true;
  return cachedVoice;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    voiceResolved = false;
    resolveKoreanVoice();
  });
}

function playWithSpeechSynthesis(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.85;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = resolveKoreanVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

// ---- Public API ----

/**
 * Play Korean pronunciation for the given text.
 * Tries Google Translate TTS first, falls back to SpeechSynthesis.
 */
export function playKorean(text: string): void {
  if (typeof window === "undefined") return;

  playWithGoogleTts(text).catch(() => {
    playWithSpeechSynthesis(text);
  });
}

/**
 * Backward-compatible alias used by existing components.
 */
export function playCharacterAudio(character: string, _audioUrl?: string): void {
  playKorean(character);
}
