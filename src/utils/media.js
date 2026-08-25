export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v', 'ogv'];
export const AUDIO_EXTENSIONS = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'];
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'];

export const ACCEPTED_TYPES = [...VIDEO_EXTENSIONS, ...AUDIO_EXTENSIONS, ...IMAGE_EXTENSIONS];

export function getMediaType(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  if (AUDIO_EXTENSIONS.includes(ext)) return 'audio';
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  return 'unknown';
}

export function getMediaTypeFromMime(mime) {
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('image/')) return 'image';
  return 'unknown';
}

export function validateFile(file) {
  const errors = [];
  const type = getMediaType(file);
  if (type === 'unknown') {
    errors.push(`Unsupported file type: ${file.name}`);
    return { valid: false, errors, type };
  }
  const maxSize = 500 * 1024 * 1024; // 500MB
  if (file.size > maxSize) {
    errors.push(`File too large (max 500MB): ${file.name}`);
  }
  return { valid: errors.length === 0, errors, type };
}

export async function generateVideoThumbnail(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);

    video.addEventListener('loadeddata', () => {
      try {
        video.currentTime = Math.min(1, video.duration / 2 || 0);
      } catch {
        resolve({ thumbnail: null, duration: video.duration, width: video.videoWidth, height: video.videoHeight });
      }
    });

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      const targetWidth = 320;
      const scale = targetWidth / (video.videoWidth || 320);
      canvas.width = targetWidth;
      canvas.height = (video.videoHeight || 180) * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
      resolve({ thumbnail, duration: video.duration, width: video.videoWidth, height: video.videoHeight });
      URL.revokeObjectURL(url);
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      resolve({ thumbnail: null, duration: 0, width: 0, height: 0 });
    });

    video.src = url;
  });
}

export async function generateImageThumbnail(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetWidth = 320;
      const scale = targetWidth / (img.naturalWidth || 320);
      canvas.width = targetWidth;
      canvas.height = (img.naturalHeight || 180) * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
      resolve({ thumbnail, duration: 5, width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ thumbnail: null, duration: 5, width: 0, height: 0 });
    };
    img.src = url;
  });
}

export async function getAudioMetadata(file) {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    const url = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      resolve({ duration: audio.duration, width: 0, height: 0 });
      URL.revokeObjectURL(url);
    });
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      resolve({ duration: 0, width: 0, height: 0 });
    });
    audio.src = url;
  });
}

export async function generateMediaThumbnail(file) {
  const type = getMediaType(file);
  if (type === 'video') return generateVideoThumbnail(file);
  if (type === 'image') return generateImageThumbnail(file);
  if (type === 'audio') return getAudioMetadata(file);
  return { thumbnail: null, duration: 0, width: 0, height: 0 };
}

export function formatResolution(width, height) {
  if (!width || !height) return 'Unknown';
  return `${width}×${height}`;
}
