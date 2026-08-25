// Export service — orchestrates the render pipeline
// Uses MediaRecorder for real-time capture, with FFmpeg fallback for higher quality

import { getCanvasDimensions } from '@/services/ffmpeg/videoProcessor';

export const EXPORT_RESOLUTIONS = {
  '480p': { width: 854, height: 480, label: '480p — SD' },
  '720p': { width: 1280, height: 720, label: '720p — HD' },
  '1080p': { width: 1920, height: 1080, label: '1080p — Full HD' },
  '1440p': { width: 2560, height: 1440, label: '1440p — 2K' },
  '2160p': { width: 3840, height: 2160, label: '2160p — 4K' },
};

export const EXPORT_FPS = [24, 25, 30, 50, 60];

export const EXPORT_FORMATS = {
  webm: { mimeType: 'video/webm;codecs=vp9,opus', extension: 'webm', label: 'WebM' },
  mp4: { mimeType: 'video/mp4;codecs=h264,aac', extension: 'mp4', label: 'MP4' },
};

export function getSupportedFormat() {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4;codecs=h264,aac',
    'video/mp4',
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return 'video/webm';
}

export function createExportCanvas(aspectRatio, resolution) {
  const dims = getCanvasDimensions(aspectRatio);
  const canvas = document.createElement('canvas');
  const res = EXPORT_RESOLUTIONS[resolution] || EXPORT_RESOLUTIONS['1080p'];
  // Scale to resolution while maintaining aspect ratio
  const aspectW = dims.width;
  const aspectH = dims.height;
  if (aspectW > aspectH) {
    canvas.width = res.width;
    canvas.height = Math.round(res.width * (aspectH / aspectW));
  } else {
    canvas.height = res.height;
    canvas.width = Math.round(res.height * (aspectW / aspectH));
  }
  return canvas;
}

export async function exportProject(project, mediaItems, settings, onProgress) {
  const { resolution = '1080p', fps = 30, format = 'webm' } = settings;
  const canvas = createExportCanvas(project.aspectRatio, resolution);
  const ctx = canvas.getContext('2d');

  const mimeType = getSupportedFormat();
  const stream = canvas.captureStream(fps);

  // Try to add audio tracks
  const audioClips = project.clips.filter((c) => c.type === 'audio');
  const audioElements = [];
  if (audioClips.length > 0) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();
      audioClips.forEach((clip) => {
        const media = mediaItems.find((m) => m.id === clip.assetId);
        if (media?.url) {
          const audio = new Audio(media.url);
          audioElements.push(audio);
          const source = audioCtx.createMediaElementSource(audio);
          const gain = audioCtx.createGain();
          gain.gain.value = clip.volume || 1;
          source.connect(gain);
          gain.connect(dest);
        }
      });
      dest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
    } catch {
      // Audio mixing may fail in some contexts
    }
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: getBitrate(resolution, settings.quality),
  });

  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const duration = project.clips.reduce((max, c) => Math.max(max, c.start + c.duration), 0);
  if (duration === 0) {
    throw new Error('Project is empty. Add clips to the timeline before exporting.');
  }

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      audioElements.forEach((a) => { a.pause(); a.src = ''; });
      resolve(blob);
    };

    recorder.onerror = (e) => reject(e.error || new Error('Recording failed'));

    recorder.start();
    onProgress({ phase: 'rendering', progress: 0 });

    const totalFrames = Math.ceil(duration * fps);
    let currentFrame = 0;

    const videoElements = {};
    project.clips
      .filter((c) => c.type === 'video')
      .forEach((clip) => {
        const media = mediaItems.find((m) => m.id === clip.assetId);
        if (media?.url) {
          const video = document.createElement('video');
          video.src = media.url;
          video.muted = true;
          video.playsInline = true;
          videoElements[clip.id] = video;
        }
      });

    const imageElements = {};
    project.clips
      .filter((c) => c.type === 'image')
      .forEach((clip) => {
        const media = mediaItems.find((m) => m.id === clip.assetId);
        if (media?.url) {
          const img = new Image();
          img.src = media.url;
          imageElements[clip.id] = img;
        }
      });

    const startAudio = () => {
      audioElements.forEach((a) => { a.currentTime = 0; a.play().catch(() => {}); });
    };
    startAudio();

    const renderFrame = () => {
      if (currentFrame >= totalFrames) {
        onProgress({ phase: 'finalizing', progress: 95 });
        setTimeout(() => {
          recorder.stop();
          onProgress({ phase: 'done', progress: 100 });
        }, 200);
        return;
      }

      const currentTime = currentFrame / fps;
      onProgress({
        phase: 'rendering',
        progress: Math.round((currentFrame / totalFrames) * 90),
        currentTime,
      });

      // Clear canvas
      ctx.fillStyle = project.settings?.canvasColor || '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render clips at current time
      const activeClips = project.clips
        .filter((c) => currentTime >= c.start && currentTime < c.start + c.duration)
        .sort((a, b) => project.clips.indexOf(a) - project.clips.indexOf(b));

      for (const clip of activeClips) {
        const track = project.tracks.find((t) => t.id === clip.trackId);
        if (!track || !track.visible || track.locked) continue;

        ctx.save();
        if (clip.type === 'video' && videoElements[clip.id]) {
          const video = videoElements[clip.id];
          const localTime = currentTime - clip.start + (clip.sourceStart || 0);
          if (Math.abs(video.currentTime - localTime) > 0.1) {
            video.currentTime = localTime;
          }
          if (video.readyState >= 2) {
            ctx.filter = buildFilterString(clip.filters);
            ctx.globalAlpha = clip.transform?.opacity ?? 1;
            drawWithTransform(ctx, clip.transform, canvas, () => {
              ctx.drawImage(video, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            });
          }
        } else if (clip.type === 'image' && imageElements[clip.id]) {
          const img = imageElements[clip.id];
          if (img.complete) {
            ctx.filter = buildFilterString(clip.filters);
            ctx.globalAlpha = clip.transform?.opacity ?? 1;
            drawWithTransform(ctx, clip.transform, canvas, () => {
              ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            });
          }
        } else if (clip.type === 'text') {
          drawWithTransform(ctx, clip.transform, canvas, () => {
            drawTextOnCanvas(ctx, clip.text, clip.textStyle, canvas);
          });
        } else if (clip.type === 'sticker') {
          ctx.save();
          ctx.font = `${clip.size || 64}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(clip.emoji || '⭐', 0, 0);
          ctx.restore();
        }
        ctx.restore();
      }

      currentFrame++;
      requestAnimationFrame(renderFrame);
    };

    // Wait for videos to be ready
    const readyPromises = Object.values(videoElements).map(
      (v) => new Promise((res) => {
        if (v.readyState >= 2) res();
        else v.addEventListener('loadeddata', () => res(), { once: true });
        v.addEventListener('error', () => res(), { once: true });
      })
    );
    Promise.all(readyPromises).then(() => {
      onProgress({ phase: 'rendering', progress: 5 });
      renderFrame();
    });
  });
}

function buildFilterString(filters = {}) {
  const parts = [];
  if (filters.brightness && filters.brightness !== 1) parts.push(`brightness(${filters.brightness})`);
  if (filters.contrast && filters.contrast !== 1) parts.push(`contrast(${filters.contrast})`);
  if (filters.saturation && filters.saturation !== 1) parts.push(`saturate(${filters.saturation})`);
  if (filters.hue) parts.push(`hue-rotate(${filters.hue}deg)`);
  if (filters.blur && filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
  if (filters.grayscale) parts.push(`grayscale(${filters.grayscale})`);
  if (filters.sepia) parts.push(`sepia(${filters.sepia})`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

function drawWithTransform(ctx, transform, canvas, drawFn) {
  const { x = 0, y = 0, scale = 1, rotation = 0, flipH = false, flipV = false } = transform || {};
  ctx.save();
  ctx.translate(canvas.width / 2 + x, canvas.height / 2 + y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flipH ? -scale : scale, flipV ? -scale : scale);
  drawFn();
  ctx.restore();
}

function drawTextOnCanvas(ctx, text, style, canvas) {
  const {
    fontFamily = 'Inter',
    fontSize = 48,
    fontWeight = 700,
    color = '#ffffff',
    align = 'center',
    italic = false,
    stroke = false,
    strokeColor = '#000000',
    strokeWidth = 2,
    shadow = false,
    shadowBlur = 8,
    shadowColor = '#000000',
  } = style || {};

  const scaledSize = fontSize * (canvas.height / 1080);
  ctx.font = `${italic ? 'italic ' : ''}${fontWeight} ${scaledSize}px ${fontFamily}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  if (shadow) {
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
  }

  ctx.fillStyle = color;
  const x = align === 'center' ? 0 : align === 'left' ? -canvas.width / 2 + 40 : canvas.width / 2 - 40;
  ctx.fillText(text || '', x, 0);

  if (stroke) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(text || '', x, 0);
  }
}

function getBitrate(resolution, quality) {
  const bitrates = {
    '480p': { low: 1_000_000, medium: 2_000_000, high: 4_000_000 },
    '720p': { low: 2_000_000, medium: 4_000_000, high: 8_000_000 },
    '1080p': { low: 4_000_000, medium: 8_000_000, high: 16_000_000 },
    '1440p': { low: 8_000_000, medium: 12_000_000, high: 24_000_000 },
    '2160p': { low: 16_000_000, medium: 32_000_000, high: 64_000_000 },
  };
  const res = bitrates[resolution] || bitrates['1080p'];
  return res[quality] || res.high;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
