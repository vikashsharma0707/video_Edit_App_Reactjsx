import { useRef, useCallback, useState } from 'react';
import editorStore from '@/store/editorStore';
import { TRACK_HEIGHT, timeToPixels, pixelsToTime, MIN_CLIP_DURATION, snapClips, SNAP_THRESHOLD } from '@/utils/timeline';
import { formatTime } from '@/utils/time';
import { Scissors, Copy, Trash2, Lock, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

function TimelineClip({ clip, track, pixelsPerSecond, isSelected, onSelect, allClips }) {
  const { selectClip, moveClip, trimClip, deleteClip, duplicateClip, splitClip, updateClip, currentTime, snapEnabled } = editorStore();
  const clipRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const left = timeToPixels(clip.start, pixelsPerSecond);
  const width = timeToPixels(clip.duration, pixelsPerSecond);

  const handleMouseDown = useCallback((e, action) => {
    e.stopPropagation();
    e.preventDefault();
    if (track.locked) return;

    selectClip(clip.id);
    const startX = e.clientX;
    const startStart = clip.start;
    const startDuration = clip.duration;

    setDragState({ action, startX, startStart, startDuration });

    const onMove = (ev) => {
      const deltaX = ev.clientX - startX;
      const deltaTime = pixelsToTime(deltaX, pixelsPerSecond);

      if (action === 'move') {
        let newStart = Math.max(0, startStart + deltaTime);
        if (snapEnabled) {
          const snapPoints = [0, ...allClips.filter((c) => c.id !== clip.id).flatMap((c) => [c.start, c.start + c.duration])];
          newStart = snapClips(newStart, allClips, clip.id, SNAP_THRESHOLD / pixelsPerSecond);
        }
        updateClip(clip.id, { start: newStart }, false);
      } else if (action === 'trim-left') {
        let newStart = Math.max(0, startStart + deltaTime);
        const maxDelta = startDuration - MIN_CLIP_DURATION;
        if (newStart < startStart - maxDelta) newStart = startStart - maxDelta;
        if (snapEnabled) {
          newStart = snapClips(newStart, allClips, clip.id, SNAP_THRESHOLD / pixelsPerSecond);
        }
        const delta = newStart - startStart;
        const newDuration = startDuration - delta;
        const speed = clip.speed || 1;
        updateClip(clip.id, {
          start: newStart,
          duration: newDuration,
          sourceStart: (clip.sourceStart || 0) + delta * speed,
        }, false);
      } else if (action === 'trim-right') {
        let newDuration = Math.max(MIN_CLIP_DURATION, startDuration + deltaTime);
        if (snapEnabled) {
          const endTime = startStart + newDuration;
          const snapped = snapClips(endTime, allClips, clip.id, SNAP_THRESHOLD / pixelsPerSecond);
          newDuration = snapped - startStart;
          if (newDuration < MIN_CLIP_DURATION) newDuration = MIN_CLIP_DURATION;
        }
        const speed = clip.speed || 1;
        updateClip(clip.id, {
          duration: newDuration,
          sourceEnd: (clip.sourceStart || 0) + newDuration * speed,
        }, false);
      }
    };

    const onUp = () => {
      setDragState(null);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      // Record history by calling updateClip one final time
      updateClip(clip.id, {}, true);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [clip, track, pixelsPerSecond, selectClip, updateClip, allClips, snapEnabled]);

  const clipColors = {
    video: { bg: 'bg-blue-600/80', border: 'border-blue-400', text: 'text-blue-100' },
    audio: { bg: 'bg-purple-600/80', border: 'border-purple-400', text: 'text-purple-100' },
    text: { bg: 'bg-amber-600/80', border: 'border-amber-400', text: 'text-amber-100' },
    sticker: { bg: 'bg-pink-600/80', border: 'border-pink-400', text: 'text-pink-100' },
    effect: { bg: 'bg-cyan-600/80', border: 'border-cyan-400', text: 'text-cyan-100' },
    image: { bg: 'bg-emerald-600/80', border: 'border-emerald-400', text: 'text-emerald-100' },
  };

  const colors = clipColors[clip.type] || clipColors.video;

  return (
    <div
      ref={clipRef}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`absolute top-1 bottom-1 rounded-md cursor-grab active:cursor-grabbing ${colors.bg} ${colors.border} ${isSelected ? 'ring-2 ring-white' : ''} border overflow-hidden group/clip select-none`}
      style={{
        left,
        width: Math.max(width, 20),
      }}
    >
      {/* Trim handles */}
      <div
        onMouseDown={(e) => handleMouseDown(e, 'trim-left')}
        className="absolute left-0 top-0 bottom-0 w-1.5 bg-white/30 hover:bg-white/60 cursor-ew-resize z-10"
      />
      <div
        onMouseDown={(e) => handleMouseDown(e, 'trim-right')}
        className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/30 hover:bg-white/60 cursor-ew-resize z-10"
      />

      {/* Clip content */}
      <div className="px-2 py-1 flex items-center h-full overflow-hidden">
        <span className={`text-xs font-medium ${colors.text} truncate`}>
          {clip.type === 'text' ? clip.text : clip.name}
        </span>
      </div>

      {/* Audio waveform placeholder */}
      {clip.type === 'audio' && (
        <div className="absolute bottom-0 left-0 right-0 h-4 flex items-center justify-around opacity-40">
          {Array.from({ length: Math.floor(width / 4) }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 bg-white"
              style={{ height: `${20 + Math.sin(i * 0.5) * 40 + Math.random() * 30}%` }}
            />
          ))}
        </div>
      )}

      {/* Clip actions on hover */}
      <div className="absolute top-0 right-0 flex opacity-0 group-hover/clip:opacity-100 transition-opacity bg-black/40 rounded-bl-md">
        <button
          onClick={(e) => { e.stopPropagation(); splitClip(clip.id, currentTime); }}
          className="p-1 hover:bg-white/20"
          title="Split"
        >
          <Scissors size={10} className="text-white" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); duplicateClip(clip.id); }}
          className="p-1 hover:bg-white/20"
          title="Duplicate"
        >
          <Copy size={10} className="text-white" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); deleteClip(clip.id); }}
          className="p-1 hover:bg-white/20"
          title="Delete"
        >
          <Trash2 size={10} className="text-white" />
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-7 left-0 px-1.5 py-0.5 bg-workspace-900 border border-workspace-600 rounded text-xxs text-workspace-200 whitespace-nowrap pointer-events-none z-50">
          {clip.name} | {formatTime(clip.start)} - {formatTime(clip.start + clip.duration)}
        </div>
      )}
    </div>
  );
}

export default TimelineClip;
