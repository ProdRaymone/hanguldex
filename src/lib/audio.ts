/**
 * 音频播放工具 — 预留 Web Audio API 接口
 * 当前阶段使用 SpeechSynthesis 作为 placeholder，
 * 后续替换为预录音频文件 + Web Audio API
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * 播放韩文字符发音
 * TODO: 替换为真实音频文件加载
 */
export function playCharacterAudio(character: string, audioUrl?: string): void {
  // 优先尝试加载音频文件
  if (audioUrl) {
    playFromUrl(audioUrl).catch(() => {
      // 音频文件不存在时回退到 TTS
      playWithTTS(character);
    });
    return;
  }
  playWithTTS(character);
}

async function playFromUrl(url: string): Promise<void> {
  const ctx = getAudioContext();
  const response = await fetch(url);
  if (!response.ok) throw new Error("Audio not found");
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  source.start();
}

function playWithTTS(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
}
