// Speech-to-Text service abstraction
// Requires a backend API or API key configured via environment variable.
// Does NOT fake results.

export function isSpeechToTextConfigured() {
  return Boolean(import.meta.env.VITE_SPEECH_TO_TEXT_API_KEY || import.meta.env.VITE_AI_API_URL);
}

export async function transcribeAudio(audioBlob, options = {}) {
  const apiKey = import.meta.env.VITE_SPEECH_TO_TEXT_API_KEY;
  const apiUrl = import.meta.env.VITE_AI_API_URL;

  if (!apiKey && !apiUrl) {
    throw new Error('AI service not configured. Set VITE_SPEECH_TO_TEXT_API_KEY or VITE_AI_API_URL in your environment.');
  }

  // This is the integration point — connect to your STT provider (Whisper, Google, etc.)
  // Example architecture:
  // const formData = new FormData();
  // formData.append('audio', audioBlob);
  // formData.append('language', options.language || 'en');
  // const response = await fetch(apiUrl || 'https://api.openai.com/v1/audio/transcriptions', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${apiKey}` },
  //   body: formData,
  // });
  // return response.json();

  throw new Error('Speech-to-text backend not yet connected. Configure your provider endpoint.');
}
