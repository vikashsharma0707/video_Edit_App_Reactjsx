import { useRef, useCallback } from 'react';
import editorStore from '@/store/editorStore';
import timelineStore from '@/store/timelineStore';
import { TRACK_HEADER_WIDTH, TRACK_HEIGHT, timeToPixels, pixelsToTime, getProjectDuration } from '@/utils/timeline';
import { formatTime } from '@/utils/time';
import TimeRuler from './TimeRuler';
import TimelineTrack from './TimelineTrack';
import Playhead from './Playhead';

function Timeline() {
  const scrollRef = useRef(null);
  const { project, currentTime, setCurrentTime, isPlaying, setPlaying, selectedClipId, selectClip, zoom } = editorStore();
  const { pixelsPerSecond, setScroll } = timelineStore();

  const duration = project ? getProjectDuration(project.tracks, project.clips) : 0;
  const timelineWidth = Math.max(timeToPixels(duration + 5, pixelsPerSecond), 800);

  const handleRulerClick = useCallback((e) => {
    const rect = scrollRef.current.getBoundingClientRect();
    const scrollLeft = scrollRef.current.scrollLeft;
    const x = e.clientX - rect.left - TRACK_HEADER_WIDTH + scrollLeft;
    const time = Math.max(0, pixelsToTime(x, pixelsPerSecond));
    setCurrentTime(time);
  }, [pixelsPerSecond, setCurrentTime]);

  const handleScroll = useCallback((e) => {
    setScroll(e.target.scrollLeft, e.target.scrollTop);
  }, [setScroll]);

  // Auto-scroll playhead during playback
  const handlePlayheadAutoScroll = useCallback(() => {
    if (!scrollRef.current || !isPlaying) return;
    const playheadX = timeToPixels(currentTime, pixelsPerSecond);
    const viewport = scrollRef.current;
    const viewportRight = viewport.scrollLeft + viewport.clientWidth - TRACK_HEADER_WIDTH;
    if (playheadX > viewportRight - 50 || playheadX < viewport.scrollLeft) {
      viewport.scrollLeft = Math.max(0, playheadX - 100);
    }
  }, [currentTime, isPlaying, pixelsPerSecond]);

  if (!project) return null;

  return (
    <div className="flex flex-col bg-workspace-900 border-t border-workspace-700 h-full min-h-0">
      {/* Timeline toolbar */}
      <TimelineToolbar duration={duration} />

      {/* Timeline body */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Ruler row */}
        <div className="flex h-7 border-b border-workspace-700 shrink-0">
          <div
            className="shrink-0 bg-workspace-850 border-r border-workspace-700 flex items-center justify-center"
            style={{ width: TRACK_HEADER_WIDTH }}
          >
            <span className="text-xs text-workspace-400 font-mono">{formatTime(duration)}</span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div
              style={{ width: timelineWidth }}
              onClick={handleRulerClick}
              className="h-full cursor-pointer"
            >
              <TimeRuler duration={duration + 5} pixelsPerSecond={pixelsPerSecond} />
            </div>
          </div>
        </div>

        {/* Tracks area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto scrollbar-thin"
        >
          <div className="flex flex-col">
            {project.tracks.map((track) => (
              <TimelineTrack
                key={track.id}
                track={track}
                clips={project.clips.filter((c) => c.trackId === track.id)}
                pixelsPerSecond={pixelsPerSecond}
                timelineWidth={timelineWidth}
                selectedClipId={selectedClipId}
                onSelectClip={selectClip}
                currentTime={currentTime}
              />
            ))}
          </div>
          {/* Playhead overlay */}
          <Playhead
            pixelsPerSecond={pixelsPerSecond}
            timelineWidth={timelineWidth}
            trackCount={project.tracks.length}
          />
        </div>
      </div>
    </div>
  );
}

function TimelineToolbar({ duration }) {
  const { zoom, setZoom } = editorStore();
  const { pixelsPerSecond, setPixelsPerSecond } = timelineStore();

  const zoomIn = () => {
    const v = Math.min(500, pixelsPerSecond * 1.5);
    setPixelsPerSecond(v);
    setZoom(v);
  };
  const zoomOut = () => {
    const v = Math.max(5, pixelsPerSecond / 1.5);
    setPixelsPerSecond(v);
    setZoom(v);
  };
  const fit = () => {
    if (duration > 0) {
      const container = document.querySelector('.timeline-scroll');
      const w = container?.clientWidth || 800;
      const v = (w - 120) / duration;
      setPixelsPerSecond(v);
      setZoom(v);
    }
  };

  return (
    <div className="h-9 flex items-center justify-between px-3 border-b border-workspace-700 bg-workspace-850 shrink-0">
      <div className="flex items-center gap-1">
        <span className="text-xs text-workspace-400 font-medium">Timeline</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={zoomOut} className="icon-btn" aria-label="Zoom out">
          <span className="text-xs">−</span>
        </button>
        <input
          type="range"
          min="5"
          max="500"
          value={pixelsPerSecond}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setPixelsPerSecond(v);
            setZoom(v);
          }}
          className="w-24"
        />
        <button onClick={zoomIn} className="icon-btn" aria-label="Zoom in">
          <span className="text-xs">+</span>
        </button>
      </div>
    </div>
  );
}

export default Timeline;
