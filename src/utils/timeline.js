import { clamp, snapTo } from './time';

export const TRACK_TYPES = {
  VIDEO: 'video',
  AUDIO: 'audio',
  TEXT: 'text',
  STICKER: 'sticker',
  EFFECT: 'effect',
  IMAGE: 'image',
};

export const TRACK_HEIGHT = 56;
export const TRACK_HEADER_WIDTH = 120;
export const MIN_CLIP_DURATION = 0.1;
export const SNAP_THRESHOLD = 8;

export function timeToPixels(time, pixelsPerSecond) {
  return time * pixelsPerSecond;
}

export function pixelsToTime(pixels, pixelsPerSecond) {
  return pixels / pixelsPerSecond;
}

export function getClipAtTime(clips, trackId, time) {
  return clips.find(
    (c) => c.trackId === trackId && time >= c.start && time < c.start + c.duration
  );
}

export function getAllClipsAtTime(clips, time) {
  return clips.filter((c) => time >= c.start && time < c.start + c.duration);
}

export function getTrackDuration(clips, trackId) {
  return clips
    .filter((c) => c.trackId === trackId)
    .reduce((max, c) => Math.max(max, c.start + c.duration), 0);
}

export function getProjectDuration(tracks, clips) {
  return tracks.reduce((max, track) => {
    return Math.max(max, getTrackDuration(clips, track.id));
  }, 0);
}

export function findFreeTrackSlot(tracks, type) {
  const sameType = tracks.filter((t) => t.type === type);
  return sameType.length;
}

export function checkCollision(clips, trackId, start, duration, excludeId = null) {
  return clips.some(
    (c) =>
      c.trackId === trackId &&
      c.id !== excludeId &&
      start < c.start + c.duration &&
      start + duration > c.start
  );
}

export function snapClips(value, clips, excludeId = null, threshold = SNAP_THRESHOLD) {
  const points = [0];
  clips.forEach((c) => {
    if (c.id !== excludeId) {
      points.push(c.start, c.start + c.duration);
    }
  });
  return snapTo(value, points, threshold);
}

export function splitClip(clip, splitTime) {
  if (splitTime <= clip.start || splitTime >= clip.start + clip.duration) {
    return null;
  }
  const firstDuration = splitTime - clip.start;
  const secondDuration = clip.duration - firstDuration;
  const sourceOffset = splitTime - clip.start;

  return [
    {
      ...clip,
      duration: firstDuration,
      sourceEnd: (clip.sourceStart || 0) + firstDuration * (clip.speed || 1),
    },
    {
      ...clip,
      id: clip.id + '_b',
      start: splitTime,
      duration: secondDuration,
      sourceStart: (clip.sourceStart || 0) + sourceOffset * (clip.speed || 1),
      sourceEnd: (clip.sourceEnd || 0),
    },
  ];
}

export function trimClipLeft(clip, newStart, trackClips) {
  const delta = newStart - clip.start;
  const newDuration = clip.duration - delta;
  if (newDuration < 0.1) return clip;
  return {
    ...clip,
    start: newStart,
    duration: newDuration,
    sourceStart: (clip.sourceStart || 0) + delta * (clip.speed || 1),
  };
}

export function trimClipRight(clip, newDuration) {
  if (newDuration < 0.1) return clip;
  return {
    ...clip,
    duration: newDuration,
    sourceEnd: (clip.sourceStart || 0) + newDuration * (clip.speed || 1),
  };
}

export function moveClip(clip, newStart, trackClips, allClips) {
  return { ...clip, start: Math.max(0, newStart) };
}

export function getSnapPoints(clips, excludeId = null) {
  const points = [0];
  clips.forEach((c) => {
    if (c.id !== excludeId) {
      points.push(c.start, c.start + c.duration);
    }
  });
  return points;
}

export function calculateZoomLevel(duration, viewportWidth, pps) {
  if (duration === 0) return pps;
  const fitPps = viewportWidth / duration;
  return fitPps;
}
