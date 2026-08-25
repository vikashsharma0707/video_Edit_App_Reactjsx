import { useRef, useEffect, useCallback } from 'react';
import editorStore from '@/store/editorStore';
import mediaStore from '@/store/mediaStore';
import { getAspectRatioValue } from '@/utils/project';
import { drawTextOnCanvas } from '@/services/ffmpeg/videoProcessor';

function VideoPreview({ canvasRef, videoRefs }) {
  const containerRef = useRef(null);
  const { project, currentTime, isPlaying, duration } = editorStore();
  const mediaItems = mediaStore((s) => s.mediaItems);

  const aspect = getAspectRatioValue(project?.aspectRatio || '16:9');

  // Render frame on canvas
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !project) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Background
    ctx.fillStyle = project.settings?.canvasColor || '#000000';
    ctx.fillRect(0, 0, width, height);

    // Get active clips at current time, sorted by track order
    const activeClips = project.clips
      .filter((c) => currentTime >= c.start && currentTime < c.start + c.duration)
      .sort((a, b) => {
        const ta = project.tracks.findIndex((t) => t.id === a.trackId);
        const tb = project.tracks.findIndex((t) => t.id === b.trackId);
        return ta - tb;
      });

    for (const clip of activeClips) {
      const track = project.tracks.find((t) => t.id === clip.trackId);
      if (!track?.visible) continue;

      ctx.save();

      if (clip.type === 'video') {
        const media = mediaItems.find((m) => m.id === clip.assetId);
        const video = videoRefs.current[clip.id];
        if (video && video.readyState >= 2) {
          applyFilters(ctx, clip.filters);
          ctx.globalAlpha = clip.transform?.opacity ?? 1;
          drawWithTransform(ctx, clip.transform, width, height, () => {
            // Cover-fit the video
            const vw = video.videoWidth || width;
            const vh = video.videoHeight || height;
            const scale = Math.max(width / vw, height / vh);
            const dw = vw * scale;
            const dh = vh * scale;
            ctx.drawImage(video, -dw / 2, -dh / 2, dw, dh);
          });
        } else if (!media) {
          // Demo clip placeholder
          drawPlaceholder(ctx, clip, width, height);
        }
      } else if (clip.type === 'image') {
        const media = mediaItems.find((m) => m.id === clip.assetId);
        const img = videoRefs.current[clip.id];
        if (img && img.complete) {
          applyFilters(ctx, clip.filters);
          ctx.globalAlpha = clip.transform?.opacity ?? 1;
          drawWithTransform(ctx, clip.transform, width, height, () => {
            const iw = img.naturalWidth || width;
            const ih = img.naturalHeight || height;
            const scale = Math.max(width / iw, height / ih);
            const dw = iw * scale;
            const dh = ih * scale;
            ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
          });
        } else if (!media) {
          drawPlaceholder(ctx, clip, width, height);
        }
      } else if (clip.type === 'text') {
        drawWithTransform(ctx, clip.transform, width, height, () => {
          drawTextOnCanvas(ctx, clip.text, clip.textStyle, { width, height });
        });
      } else if (clip.type === 'sticker') {
        drawWithTransform(ctx, clip.transform, width, height, () => {
          ctx.font = `${clip.size || 64}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(clip.emoji || '⭐', 0, 0);
        });
      }

      ctx.restore();
    }

    // Selection bounding box
    const selectedId = editorStore.getState().selectedClipId;
    if (selectedId) {
      const selClip = activeClips.find((c) => c.id === selectedId);
      if (selClip && (selClip.type === 'text' || selClip.type === 'sticker' || selClip.type === 'image' || selClip.type === 'video')) {
        drawBoundingBox(ctx, selClip, width, height);
      }
    }
  }, [project, currentTime, mediaItems, videoRefs]);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const containerAspect = rect.width / rect.height;
      const targetAspect = aspect.width / aspect.height;

      let canvasW, canvasH;
      if (containerAspect > targetAspect) {
        canvasH = rect.height;
        canvasW = canvasH * targetAspect;
      } else {
        canvasW = rect.width;
        canvasH = canvasW / targetAspect;
      }

      canvas.width = Math.floor(canvasW);
      canvas.height = Math.floor(canvasH);
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      renderFrame();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [aspect, renderFrame]);

  // Render on time/clip changes
  useEffect(() => {
    renderFrame();
  }, [renderFrame, currentTime, project]);

  // Sync video elements
  useEffect(() => {
    if (!project) return;
    project.clips
      .filter((c) => c.type === 'video')
      .forEach((clip) => {
        const video = videoRefs.current[clip.id];
        if (!video) return;
        const localTime = currentTime - clip.start + (clip.sourceStart || 0);
        if (isPlaying) {
          if (Math.abs(video.currentTime - localTime) > 0.3) {
            video.currentTime = localTime;
          }
        } else {
          if (Math.abs(video.currentTime - localTime) > 0.05) {
            video.currentTime = localTime;
          }
        }
      });
  }, [currentTime, isPlaying, project, videoRefs]);

  // Manage video/image elements
  useEffect(() => {
    if (!project) return;
    const videoClips = project.clips.filter((c) => c.type === 'video');
    const imageClips = project.clips.filter((c) => c.type === 'image');

    videoClips.forEach((clip) => {
      const media = mediaItems.find((m) => m.id === clip.assetId);
      if (media?.url && !videoRefs.current[clip.id]) {
        const video = document.createElement('video');
        video.src = media.url;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        videoRefs.current[clip.id] = video;
      }
    });

    imageClips.forEach((clip) => {
      const media = mediaItems.find((m) => m.id === clip.assetId);
      if (media?.url && !videoRefs.current[clip.id]) {
        const img = new Image();
        img.src = media.url;
        videoRefs.current[clip.id] = img;
      }
    });

    // Clean up removed clips
    Object.keys(videoRefs.current).forEach((id) => {
      if (!project.clips.find((c) => c.id === id)) {
        const el = videoRefs.current[id];
        if (el instanceof HTMLVideoElement) el.src = '';
        delete videoRefs.current[id];
      }
    });
  }, [project, mediaItems, videoRefs]);

  return (
    <div ref={containerRef} className="flex-1 flex items-center justify-center bg-workspace-950 overflow-hidden p-4 min-h-0">
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-2xl"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
}

function applyFilters(ctx, filters = {}) {
  const parts = [];
  if (filters.brightness && filters.brightness !== 1) parts.push(`brightness(${filters.brightness})`);
  if (filters.contrast && filters.contrast !== 1) parts.push(`contrast(${filters.contrast})`);
  if (filters.saturation && filters.saturation !== 1) parts.push(`saturate(${filters.saturation})`);
  if (filters.hue) parts.push(`hue-rotate(${filters.hue}deg)`);
  if (filters.blur && filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
  if (filters.grayscale) parts.push(`grayscale(${filters.grayscale})`);
  if (filters.sepia) parts.push(`sepia(${filters.sepia})`);
  ctx.filter = parts.length > 0 ? parts.join(' ') : 'none';
}

function drawWithTransform(ctx, transform, canvasW, canvasH, drawFn) {
  const { x = 0, y = 0, scale = 1, rotation = 0, flipH = false, flipV = false } = transform || {};
  ctx.save();
  ctx.translate(canvasW / 2 + x, canvasH / 2 + y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flipH ? -scale : scale, flipV ? -scale : scale);
  drawFn();
  ctx.restore();
}

function drawPlaceholder(ctx, clip, width, height) {
  ctx.save();
  ctx.fillStyle = '#1c1c1f';
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.fillStyle = '#4a4a52';
  ctx.font = '24px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(clip.name || 'Clip', 0, 0);
  ctx.restore();
}

function drawBoundingBox(ctx, clip, width, height) {
  ctx.save();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  const transform = clip.transform || {};
  const scale = transform.scale || 1;
  const baseSize = Math.min(width, height) * 0.3 * scale;

  ctx.strokeRect(-baseSize / 2, -baseSize / 2, baseSize, baseSize);

  // Corner handles
  ctx.setLineDash([]);
  ctx.fillStyle = '#10b981';
  const hs = 6;
  const corners = [
    [-baseSize / 2, -baseSize / 2],
    [baseSize / 2, -baseSize / 2],
    [-baseSize / 2, baseSize / 2],
    [baseSize / 2, baseSize / 2],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
  });

  ctx.restore();
}

export default VideoPreview;
