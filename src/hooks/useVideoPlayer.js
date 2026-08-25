import { useEffect, useRef, useCallback } from 'react';
import editorStore from '@/store/editorStore';

export default function useVideoPlayer(videoRef, canvasRef) {
  const { isPlaying, currentTime, playbackRate, duration } = editorStore();
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Sync play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
      lastTimeRef.current = performance.now();
      const tick = () => {
        if (!editorStore.getState().isPlaying) return;
        const now = performance.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;
        const state = editorStore.getState();
        const newTime = state.currentTime + delta * state.playbackRate;
        if (newTime >= state.duration) {
          editorStore.getState().setCurrentTime(state.duration);
          editorStore.getState().setPlaying(false);
          return;
        }
        editorStore.getState().setCurrentTime(newTime);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      video.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  // Sync playback rate
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // Seek video when currentTime changes externally (not during playback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isPlaying) return;
    if (Math.abs(video.currentTime - currentTime) > 0.05) {
      video.currentTime = currentTime;
    }
  }, [currentTime, isPlaying]);

  const seek = useCallback((time) => {
    editorStore.getState().setCurrentTime(time);
    if (videoRef.current) videoRef.current.currentTime = time;
  }, []);

  return { seek };
}
