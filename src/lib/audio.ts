/**
 * Korean pronunciation audio utility
 *
 * Uses Web Speech API (SpeechSynthesis) with ko-KR voice.
 * Prefers a native Korean voice if available, otherwise falls back
 * to the default ko-KR utterance.
 *
 * Future: when real audio files are added under /audio/,
 * call playFromUrl() and fall back to TTS on error.
 */

let cachedVoice: SpeechSynthesisVoice | null = null;
let voiceResolved = false;

/**
 * Find the best available Korean voice.
 * Voices load asynchronously in some browsers, so we listen for the
 * voiceschanged event and cache the result.
 */
function resolveKoreanVoice(): SpeechSynthesisVoice | null {
  if (voiceResolved) return cachedVoice;
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  // prefer native Korean voices (Google, Microsoft, Apple)
  cachedVoice =
    voices.find((v) => v.lang === "ko-KR" && !v.localService) ??
    voices.find((v) => v.lang === "ko-KR") ??
    voices.find((v) => v.lang.startsWith("ko")) ??
    null;

  if (voices.length > 0) voiceResolved = true;
  return cachedVoice;
}

// Listen for async voice list load
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    voiceResolved = false;
    resolveKoreanVoice();
  });
}

/**
 * Play Korean pronunciation for the given text.
 * This is the single entry point — all components should call this.
 */
export function playKorean(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Cancel any in-progress utterance to avoid overlap
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.8;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = resolveKoreanVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

/**
 * Backward-compatible alias — used by existing components.
 * Ignores audioUrl (no real audio files exist yet) and uses TTS directly.
 */
export function playCharacterAudio(character: string, _audioUrl?: string): void {
  playKorean(character);
}
