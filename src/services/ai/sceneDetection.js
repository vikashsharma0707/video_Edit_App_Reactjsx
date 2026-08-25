// Scene detection service abstraction
// Can use frame difference analysis client-side, or backend ML model.

export function isSceneDetectionAvailable() {
  return true; // Basic client-side detection is always available
}

export async function detectScenes(videoElement, options = {}) {
  // Client-side scene detection via frame difference analysis
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const threshold = options.threshold || 30;
  const sampleInterval = options.sampleInterval || 0.5; // seconds

  const scenes = [];
  let lastFrameData = null;
  let sceneStart = 0;

  const duration = videoElement.duration;
  const times = [];
  for (let t = 0; t < duration; t += sampleInterval) {
    times.push(t);
  }

  for (const time of times) {
    await new Promise((resolve) => {
      videoElement.currentTime = time;
      videoElement.addEventListener('seeked', resolve, { once: true });
    });

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    if (lastFrameData) {
      let diff = 0;
      const step = Math.max(1, Math.floor(frameData.length / 1000));
      for (let i = 0; i < frameData.length; i += step * 4) {
        diff += Math.abs(frameData[i] - lastFrameData[i]);
        diff += Math.abs(frameData[i + 1] - lastFrameData[i + 1]);
        diff += Math.abs(frameData[i + 2] - lastFrameData[i + 2]);
      }
      diff /= (frameData.length / (step * 4)) * 3;

      if (diff > threshold) {
        scenes.push({ start: sceneStart, end: time, index: scenes.length });
        sceneStart = time;
      }
    }
    lastFrameData = frameData;
  }

  if (sceneStart < duration) {
    scenes.push({ start: sceneStart, end: duration, index: scenes.length });
  }

  return scenes;
}
