import { useEffect, useRef, useCallback } from 'react';
import editorStore from '@/store/editorStore';
import { SHORTCUTS } from '@/utils/shortcuts';

export default function useKeyboardShortcuts() {
  const {
    togglePlay,
    splitClip,
    selectedClipId,
    deleteClip,
    undo,
    redo,
    duplicateClip,
    currentTime,
    duration,
    setCurrentTime,
    project,
    updateProject,
  } = editorStore();

  const selectedRef = useRef(selectedClipId);
  selectedRef.current = selectedClipId;
  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  const projectRef = useRef(project);
  projectRef.current = project;

  const handleKeyDown = useCallback(
    (e) => {
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      let key = e.key;
      if (e.ctrlKey || e.metaKey) {
        key = `Control${e.shiftKey ? '+Shift' : ''}+${e.key.toLowerCase()}`;
      }

      const shortcut = SHORTCUTS[key] || SHORTCUTS[e.key];
      if (!shortcut) return;

      e.preventDefault();

      switch (shortcut.action) {
        case 'playPause':
          togglePlay();
          break;
        case 'split':
          if (selectedRef.current) {
            splitClip(selectedRef.current, currentTimeRef.current);
          }
          break;
        case 'delete':
          if (selectedRef.current) deleteClip(selectedRef.current);
          break;
        case 'undo':
          undo();
          break;
        case 'redo':
          redo();
          break;
        case 'duplicate':
          if (selectedRef.current) duplicateClip(selectedRef.current);
          break;
        case 'selectAll':
          break;
        case 'prevFrame':
          setCurrentTime(Math.max(0, currentTimeRef.current - 1 / 30));
          break;
        case 'nextFrame':
          setCurrentTime(Math.min(durationRef.current, currentTimeRef.current + 1 / 30));
          break;
        case 'goToStart':
          setCurrentTime(0);
          break;
        case 'goToEnd':
          setCurrentTime(durationRef.current);
          break;
        case 'commandPalette':
          break;
        case 'copy':
          if (selectedRef.current) {
            const clip = projectRef.current?.clips.find((c) => c.id === selectedRef.current);
            if (clip) editorStore.getState().setClipboard(clip);
          }
          break;
        case 'paste':
          {
            const clipboard = editorStore.getState().clipboard;
            if (clipboard) {
              editorStore.getState().addClip({
                ...clipboard,
                id: undefined,
                start: currentTimeRef.current,
              });
            }
          }
          break;
      }
    },
    [togglePlay, splitClip, deleteClip, undo, redo, duplicateClip, setCurrentTime, updateProject]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
