// Background removal service abstraction
// Requires a backend model API or on-device ML model.

export function isBackgroundRemovalAvailable() {
  return Boolean(import.meta.env.VITE_BG_REMOVAL_API_URL || import.meta.env.VITE_AI_API_URL);
}

export async function removeBackground(imageBlob, options = {}) {
  const apiUrl = import.meta.env.VITE_BG_REMOVAL_API_URL || import.meta.env.VITE_AI_API_URL;

  if (!apiUrl) {
    throw new Error('Background removal not configured. Set VITE_BG_REMOVAL_API_URL or VITE_AI_API_URL.');
  }

  // Integration point for BG removal (rembg, U2Net, MediaPipe Selfie Segmentation, etc.)
  throw new Error('Background removal backend not yet connected.');
}

// Client-side selfie segmentation using MediaPipe (if available)
export async function removeBackgroundClient(videoElement) {
  try {
    // Dynamic import — only loaded when used
    // This would use @mediapipe/selfie_segmentation or similar
    throw new Error('Client-side background removal requires the MediaPipe library to be installed.');
  } catch (err) {
    throw new Error('Background removal is not available in this environment.');
  }
}
