export function formatTime(seconds, showFrames = false, fps = 30) {
  if (!isFinite(seconds) || seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const f = Math.floor((seconds % 1) * fps);

  const pad = (n) => String(n).padStart(2, '0');
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}${showFrames ? `.${pad(f)}` : ''}`;
  }
  return `${pad(m)}:${pad(s)}${showFrames ? `.${pad(f)}` : ''}`;
}

export function formatDuration(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatTimecode(seconds, fps = 30) {
  return formatTime(seconds, true, fps);
}

export function parseTimecode(str) {
  const parts = str.split(':');
  if (parts.length === 3) {
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
  }
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(str) || 0;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function snapTo(value, snapPoints, threshold = 8) {
  for (const point of snapPoints) {
    if (Math.abs(value - point) < threshold) return point;
  }
  return value;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
