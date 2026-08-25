import { useRef, useCallback } from 'react';
import editorStore from '@/store/editorStore';
import { TRACK_HEIGHT, TRACK_HEADER_WIDTH, timeToPixels, pixelsToTime, MIN_CLIP_DURATION, SNAP_THRESHOLD, snapClips } from '@/utils/timeline';
import TimelineClip from './TimelineClip';
import TrackControls from './TrackControls';

function TimelineTrack({ track, clips, pixelsPerSecond, timelineWidth, selectedClipId, onSelectClip, currentTime }) {
  const { updateTrack, updateClip, selectClip, splitClip, deleteClip, duplicateClip, snapEnabled } = editorStore();
  const trackRef = useRef(null);

  const trackColors = {
    video: 'bg-blue-500/10 border-blue-500/30',
    audio: 'bg-purple-500/10 border-purple-500/30',
    text: 'bg-amber-500/10 border-amber-500/30',
    sticker: 'bg-pink-500/10 border-pink-500/30',
    effect: 'bg-cyan-500/10 border-cyan-500/30',
    image: 'bg-emerald-500/10 border-emerald-500/30',
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (track.locked) return;
    const clipData = e.dataTransfer.getData('application/json');
    if (clipData) {
      const data = JSON.parse(clipData);
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let start = Math.max(0, pixelsToTime(x, pixelsPerSecond));

      if (snapEnabled) {
        start = snapClips(start, clips, null, SNAP_THRESHOLD / pixelsPerSecond);
      }

      const newClip = {
        id: undefined,
        assetId: data.assetId,
        trackId: track.id,
        type: data.type || track.type,
        name: data.name || 'Clip',
        start,
        duration: data.duration || 5,
        sourceStart: 0,
        sourceEnd: data.duration || 5,
        volume: 1,
        speed: 1,
        transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, flipH: false, flipV: false },
        filters: { brightness: 1, contrast: 1, saturation: 1 },
        color: getColorForType(data.type || track.type),
      };

      if (data.type === 'text') {
        newClip.text = data.text || 'New Text';
        newClip.textStyle = data.textStyle || {
          fontFamily: 'Inter', fontSize: 48, fontWeight: 700, color: '#ffffff', align: 'center',
          italic: false, underline: false, stroke: false, strokeColor: '#000000', strokeWidth: 2,
          shadow: false, shadowBlur: 8, shadowColor: '#000000', shadowOpacity: 0.5,
        };
        newClip.animation = { entrance: 'fade', exit: 'fade', loop: null };
      }

      if (data.type === 'sticker') {
        newClip.emoji = data.emoji || '⭐';
        newClip.size = 64;
      }

      editorStore.getState().addClip(newClip);
    }
  }, [track, clips, pixelsPerSecond, snapEnabled]);

  const handleDragOver = useCallback((e) => {
    if (track.locked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, [track.locked]);

  return (
    <div className="flex border-b border-workspace-800 group">
      {/* Track header */}
      <TrackControls track={track} />

      {/* Track content area */}
      <div
        ref={trackRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={(e) => {
          if (e.target === e.currentTarget) selectClip(null);
        }}
        className={`flex-1 relative ${track.locked ? 'opacity-50' : ''}`}
        style={{ height: TRACK_HEIGHT, minWidth: timelineWidth }}
      >
        {/* Track background */}
        <div className={`absolute inset-0 ${trackColors[track.type] || 'bg-workspace-800'} ${track.visible ? '' : 'opacity-30'}`} />

        {/* Clips */}
        {clips.map((clip) => (
          <TimelineClip
            key={clip.id}
            clip={clip}
            track={track}
            pixelsPerSecond={pixelsPerSecond}
            isSelected={selectedClipId === clip.id}
            onSelect={onSelectClip}
            allClips={clips}
          />
        ))}
      </div>
    </div>
  );
}

function getColorForType(type) {
  const colors = {
    video: '#3b82f6',
    audio: '#8b5cf6',
    text: '#f59e0b',
    sticker: '#ec4899',
    effect: '#06b6d4',
    image: '#10b981',
  };
  return colors[type] || '#3b82f6';
}

export default TimelineTrack;
