import { useCallback } from 'react';
import editorStore from '@/store/editorStore';

export default function useHistory() {
  const { undo, redo, history, redoStack } = editorStore();

  const canUndo = history.length > 0;
  const canRedo = redoStack.length > 0;

  const executeWithHistory = useCallback((action, undoData) => {
    editorStore.getState().updateProject(action);
  }, []);

  return { undo, redo, canUndo, canRedo, executeWithHistory };
}
