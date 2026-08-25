// Video processing service — canvas-based rendering pipeline
// Handles frame compositing, filters, transforms, and effects

export function applyCanvasFilters(ctx, filters = {}) {
  const parts = [];
  if (filters.brightness !== undefined && filters.brightness !== 1) parts.push(`brightness(${filters.brightness})`);
  if (filters.contrast !== undefined && filters.contrast !== 1) parts.push(`contrast(${filters.contrast})`);
  if (filters.saturation !== undefined && filters.saturation !== 1) parts.push(`saturate(${filters.saturation})`);
  if (filters.hue !== undefined) parts.push(`hue-rotate(${filters.hue}deg)`);
  if (filters.blur !== undefined && filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
  if (filters.grayscale !== undefined && filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale})`);
  if (filters.sepia !== undefined && filters.sepia > 0) parts.push(`sepia(${filters.sepia})`);
  if (parts.length > 0) ctx.filter = parts.join(' ');
  else ctx.filter = 'none';
}

export function applyTransform(ctx, transform = {}, canvasWidth, canvasHeight) {
  const { x = 0, y = 0, scale = 1, rotation = 0, opacity = 1, flipH = false, flipV = false } = transform;
  ctx.globalAlpha = opacity;
  ctx.translate(canvasWidth / 2 + x, canvasHeight / 2 + y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flipH ? -scale : scale, flipV ? -scale : scale);
}

export function drawVideoFrame(ctx, video, x, y, width, height) {
  if (video.readyState >= 2) {
    ctx.drawImage(video, x, y, width, height);
  }
}

export function drawImageFrame(ctx, image, x, y, width, height) {
  if (image.complete) {
    ctx.drawImage(image, x, y, width, height);
  }
}

export function drawText(ctx, text, style = {}, canvasWidth, canvasHeight) {
  const {
    fontFamily = 'Inter',
    fontSize = 48,
    fontWeight = 700,
    color = '#ffffff',
    align = 'center',
    italic = false,
    underline = false,
    stroke = false,
    strokeColor = '#000000',
    strokeWidth = 2,
    shadow = false,
    shadowBlur = 8,
    shadowColor = '#000000',
    shadowOpacity = 0.5,
  } = style;

  ctx.save();
  ctx.font = `${italic ? 'italic ' : ''}${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  if (shadow) {
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.globalAlpha = shadowOpacity;
    ctx.fillStyle = shadowColor;
    const x = align === 'center' ? canvasWidth / 2 : align === 'left' ? 40 : canvasWidth - 40;
    ctx.fillText(text, x, canvasHeight / 2);
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = color;
  const x = align === 'center' ? canvasWidth / 2 : align === 'left' ? 40 : canvasWidth - 40;
  ctx.fillText(text, x, canvasHeight / 2);

  if (stroke) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(text, x, canvasHeight / 2);
  }

  if (underline) {
    const metrics = ctx.measureText(text);
    const tw = metrics.width;
    const tx = align === 'center' ? canvasWidth / 2 - tw / 2 : align === 'left' ? 40 : canvasWidth - 40 - tw;
    const ty = canvasHeight / 2 + fontSize / 2;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + tw, ty);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, fontSize / 16);
    ctx.stroke();
  }
  ctx.restore();
}

export function getCanvasDimensions(aspectRatio, baseHeight = 1080) {
  const map = {
    '16:9': { width: 1920, height: 1080 },
    '9:16': { width: 1080, height: 1920 },
    '1:1': { width: 1080, height: 1080 },
    '4:5': { width: 1080, height: 1350 },
    '4:3': { width: 1440, height: 1080 },
    '21:9': { width: 2560, height: 1080 },
  };
  return map[aspectRatio] || map['16:9'];
}
