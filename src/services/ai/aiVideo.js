// AI Video service — aggregates AI tool availability and provides unified interface

import { isSpeechToTextConfigured } from './speechToText';
import { isTextToSpeechAvailable, isPremiumTTSAvailable } from './textToSpeech';
import { isCaptionGenerationAvailable } from './captions';
import { isBackgroundRemovalAvailable } from './backgroundRemoval';
import { isScriptGeneratorConfigured } from './scriptGenerator';
import { isSceneDetectionAvailable } from './sceneDetection';

export const AI_TOOLS = [
  {
    id: 'auto-captions',
    name: 'Auto Captions',
    description: 'Generate captions from speech in your video',
    icon: 'Captions',
    available: () => isCaptionGenerationAvailable(),
    category: 'Audio',
  },
  {
    id: 'speech-to-text',
    name: 'Speech to Text',
    description: 'Transcribe spoken audio to text',
    icon: 'Mic',
    available: () => isSpeechToTextConfigured(),
    category: 'Audio',
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text to natural-sounding speech',
    icon: 'Volume2',
    available: () => isTextToSpeechAvailable(),
    premium: () => isPremiumTTSAvailable(),
    category: 'Audio',
  },
  {
    id: 'ai-voiceover',
    name: 'AI Voiceover',
    description: 'Generate AI voiceover from script',
    icon: 'AudioLines',
    available: () => isPremiumTTSAvailable(),
    category: 'Audio',
  },
  {
    id: 'bg-removal',
    name: 'Background Removal',
    description: 'Remove video background using AI',
    icon: 'Scissors',
    available: () => isBackgroundRemovalAvailable(),
    category: 'Visual',
  },
  {
    id: 'object-removal',
    name: 'AI Object Removal',
    description: 'Remove unwanted objects from video',
    icon: 'Eraser',
    available: () => Boolean(import.meta.env.VITE_AI_API_URL),
    category: 'Visual',
  },
  {
    id: 'script-generator',
    name: 'AI Script Generator',
    description: 'Generate video scripts with AI',
    icon: 'FileText',
    available: () => isScriptGeneratorConfigured(),
    category: 'Writing',
  },
  {
    id: 'video-summary',
    name: 'AI Video Summary',
    description: 'Summarize your video content',
    icon: 'Sparkles',
    available: () => isScriptGeneratorConfigured(),
    category: 'Writing',
  },
  {
    id: 'scene-detection',
    name: 'Scene Detection',
    description: 'Detect scene changes in your video',
    icon: 'Layers',
    available: () => isSceneDetectionAvailable(),
    category: 'Analysis',
  },
  {
    id: 'auto-cut',
    name: 'Auto Cut',
    description: 'Automatically cut at scene changes',
    icon: 'Scissors',
    available: () => isSceneDetectionAvailable(),
    category: 'Analysis',
  },
  {
    id: 'beat-detection',
    name: 'Beat Detection',
    description: 'Detect beats in audio for sync cuts',
    icon: 'Music',
    available: () => Boolean(import.meta.env.VITE_BEAT_DETECTION_API_URL),
    category: 'Audio',
  },
  {
    id: 'smart-crop',
    name: 'Smart Crop',
    description: 'AI-powered framing and cropping',
    icon: 'Crop',
    available: () => Boolean(import.meta.env.VITE_AI_API_URL),
    category: 'Visual',
  },
  {
    id: 'ai-image',
    name: 'AI Image Generation',
    description: 'Generate images from text prompts',
    icon: 'ImagePlus',
    available: () => Boolean(import.meta.env.VITE_IMAGE_GEN_API_KEY),
    category: 'Generation',
  },
  {
    id: 'ai-video',
    name: 'AI Video Generation',
    description: 'Generate video clips from text',
    icon: 'Video',
    available: () => Boolean(import.meta.env.VITE_VIDEO_GEN_API_KEY),
    category: 'Generation',
  },
];

export function getAvailableTools() {
  return AI_TOOLS.filter((t) => t.available());
}

export function getToolById(id) {
  return AI_TOOLS.find((t) => t.id === id);
}
