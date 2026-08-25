// Caption generation service — depends on speech-to-text
import { isSpeechToTextConfigured, transcribeAudio } from './speechToText';

export function isCaptionGenerationAvailable() {
  return isSpeechToTextConfigured();
}

export async function generateCaptions(audioBlob, options = {}) {
  const transcript = await transcribeAudio(audioBlob, options);
  if (!transcript?.segments) {
    throw new Error('Transcription returned no segments.');
  }

  return transcript.segments.map((seg) => ({
    id: `cap_${seg.start}_${seg.end}`,
    text: seg.text,
    start: seg.start,
    end: seg.end,
    style: { preset: 'classic', ...options.style },
  }));
}

export const CAPTION_STYLES = {
  classic: { fontSize: 48, color: '#ffffff', stroke: true, strokeColor: '#000000', strokeWidth: 3 },
  bold: { fontSize: 56, fontWeight: 800, color: '#ffffff', stroke: true, strokeColor: '#000000', strokeWidth: 4 },
  minimal: { fontSize: 40, color: '#ffffff', stroke: false },
  karaoke: { fontSize: 52, color: '#fbbf24', stroke: true, strokeColor: '#000000', strokeWidth: 3 },
  highlight: { fontSize: 48, color: '#000000', background: '#fbbf24', backgroundOpacity: 0.9 },
  social: { fontSize: 44, color: '#ffffff', stroke: true, strokeColor: '#ec4899', strokeWidth: 3 },
  cinematic: { fontSize: 50, color: '#e5e7eb', italic: true, stroke: false, shadow: true },
};
