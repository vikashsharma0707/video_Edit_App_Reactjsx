import { useCallback } from 'react';
import editorStore from '@/store/editorStore';
import timelineStore from '@/store/timelineStore';

export default function useTimeline() {
  const { zoom, setZoom, project, currentTime, setCurrentTime, duration } = editorStore();
  const { pixelsPerSecond, setPixelsPerSecond } = timelineStore();

  const zoomIn = useCallback(() => {
    const newZoom = Math.min(500, pixelsPerSecond * 1.5);
    setPixelsPerSecond(newZoom);
    setZoom(newZoom);
  }, [pixelsPerSecond, setPixelsPerSecond, setZoom]);

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(5, pixelsPerSecond / 1.5);
    setPixelsPerSecond(newZoom);
    setZoom(newZoom);
  }, [pixelsPerSecond, setPixelsPerSecond, setZoom]);

  const fitTimeline = useCallback((viewportWidth) => {
    if (duration > 0) {
      const pps = viewportWidth / duration;
      setPixelsPerSecond(pps);
      setZoom(pps);
    }
  }, [duration, setPixelsPerSecond, setZoom]);

  const setZoomLevel = useCallback((level) => {
    setPixelsPerSecond(level);
    setZoom(level);
  }, [setPixelsPerSecond, setZoom]);

  return {
    pixelsPerSecond,
    zoomIn,
    zoomOut,
    fitTimeline,
    setZoomLevel,
  };
}
