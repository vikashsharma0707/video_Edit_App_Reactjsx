import { TRACK_HEADER_WIDTH, TRACK_HEIGHT, timeToPixels } from '@/utils/timeline';
import editorStore from '@/store/editorStore';
import timelineStore from '@/store/timelineStore';

function Playhead({ pixelsPerSecond, timelineWidth, trackCount }) {
  const { currentTime, setCurrentTime, isPlaying } = editorStore();
  const { isPlayheadDragging, setPlayheadDragging } = timelineStore();

  const left = timeToPixels(currentTime, pixelsPerSecond);
  const height = trackCount * TRACK_HEIGHT;

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setPlayheadDragging(true);

    const onMove = (ev) => {
      const scrollContainer = e.target.closest('.overflow-auto, .overflow-y-auto');
      const container = scrollContainer || document.querySelector('.timeline-scroll') || e.target.parentElement;
      const rect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft || 0;
      const x = ev.clientX - rect.left - TRACK_HEADER_WIDTH + scrollLeft;
      const time = Math.max(0, x / pixelsPerSecond);
      setCurrentTime(time);
    };

    const onUp = () => {
      setPlayheadDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  return (
    <div
      className="absolute top-0 pointer-events-none z-30"
      style={{ left: TRACK_HEADER_WIDTH + left }}
    >
      {/* Playhead line */}
      <div
        className="absolute top-0 w-px bg-red-500"
        style={{ height: height + 28 }}
      />
      {/* Playhead handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute -top-0 -left-1.5 w-3 h-3 bg-red-500 rounded-sm cursor-ew-resize pointer-events-auto"
        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
      />
    </div>
  );
}

export default Playhead;
