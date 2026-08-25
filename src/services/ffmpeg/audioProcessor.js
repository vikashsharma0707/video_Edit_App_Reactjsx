// Audio processing service — Web Audio API based

let audioContext = null;

export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export async function decodeAudioData(arrayBuffer) {
  const ctx = getAudioContext();
  return new Promise((resolve, reject) => {
    ctx.decodeAudioData(arrayBuffer, resolve, reject);
  });
}

export async function generateWaveform(audioBuffer, samples = 100) {
  const channelData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(channelData.length / samples);
  const peaks = [];

  for (let i = 0; i < samples; i++) {
    const start = i * blockSize;
    let max = 0;
    for (let j = 0; j < blockSize; j++) {
      const val = Math.abs(channelData[start + j] || 0);
      if (val > max) max = val;
    }
    peaks.push(max);
  }

  return peaks;
}

export function applyVolume(gainNode, volume) {
  gainNode.gain.value = volume;
}

export function applyFade(gainNode, startTime, duration, fadeIn = true) {
  const ctx = getAudioContext();
  if (fadeIn) {
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + duration);
  } else {
    gainNode.gain.setValueAtTime(1, startTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
  }
}

export async function extractAudioFromVideo(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (err) {
    console.warn('Could not extract audio from video:', err);
    return null;
  }
}

export function createAudioElement(url) {
  const audio = new Audio(url);
  audio.crossOrigin = 'anonymous';
  return audio;
}
