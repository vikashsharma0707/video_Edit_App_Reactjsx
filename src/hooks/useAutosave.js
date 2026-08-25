import { useEffect, useRef } from 'react';
import editorStore from '@/store/editorStore';
import projectStore from '@/store/projectStore';

export default function useAutosave(intervalMs = 30000) {
  const timerRef = useRef(null);
  const lastSaveRef = useRef(0);

  useEffect(() => {
    const autosave = async () => {
      const state = editorStore.getState();
      if (!state.project) return;
      const hasChanges = state.history.length > 0;
      if (!hasChanges) return;

      projectStore.getState().setSaveStatus('saving');
      await projectStore.getState().saveProject(state.project);
      lastSaveRef.current = Date.now();
    };

    timerRef.current = setInterval(autosave, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [intervalMs]);
}
