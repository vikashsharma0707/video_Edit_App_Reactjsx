// Text-to-Speech service abstraction
// Uses browser SpeechSynthesis API for basic TTS, with API fallback for premium voices.

export function isTextToSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getAvailableVoices() {
  if (!isTextToSpeechAvailable()) return [];
  return window.speechSynthesis.getVoices();
}

export function speak(text, options = {}) {
  if (!isTextToSpeechAvailable()) {
    throw new Error('Text-to-speech not supported in this browser.');
  }
  const utterance = new SpeechSynthesisUtterance(text);
  if (options.voice) utterance.voice = options.voice;
  if (options.rate) utterance.rate = options.rate;
  if (options.pitch) utterance.pitch = options.pitch;
  if (options.volume) utterance.volume = options.volume;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (isTextToSpeechAvailable()) {
    window.speechSynthesis.cancel();
  }
}

export function isPremiumTTSAvailable() {
  return Boolean(import.meta.env.VITE_TTS_API_KEY || import.meta.env.VITE_AI_API_URL);
}

export async function generatePremiumSpeech(text, options = {}) {
  const apiKey = import.meta.env.VITE_TTS_API_KEY;
  const apiUrl = import.meta.env.VITE_AI_API_URL;

  if (!apiKey && !apiUrl) {
    throw new Error('Premium TTS not configured. Set VITE_TTS_API_KEY or VITE_AI_API_URL.');
  }

  // Integration point for premium TTS (ElevenLabs, Google, Azure, etc.)
  throw new Error('Premium TTS backend not yet connected.');
}
