export const SHORTCUTS = {
  ' ': { action: 'playPause', label: 'Play / Pause' },
  s: { action: 'split', label: 'Split clip' },
  Delete: { action: 'delete', label: 'Delete selected' },
  Backspace: { action: 'delete', label: 'Delete selected' },
  'Control+z': { action: 'undo', label: 'Undo' },
  'Control+Shift+z': { action: 'redo', label: 'Redo' },
  'Control+c': { action: 'copy', label: 'Copy' },
  'Control+v': { action: 'paste', label: 'Paste' },
  'Control+d': { action: 'duplicate', label: 'Duplicate' },
  'Control+a': { action: 'selectAll', label: 'Select all' },
  'Control+k': { action: 'commandPalette', label: 'Command palette' },
  ArrowLeft: { action: 'prevFrame', label: 'Previous frame' },
  ArrowRight: { action: 'nextFrame', label: 'Next frame' },
  Home: { action: 'goToStart', label: 'Go to start' },
  End: { action: 'goToEnd', label: 'Go to end' },
};

export function getShortcutLabel(action) {
  const entry = Object.entries(SHORTCUTS).find(([, v]) => v.action === action);
  if (!entry) return '';
  let key = entry[0];
  key = key.replace('Control', 'Ctrl');
  return key;
}

export function getShortcutDescription(key) {
  return SHORTCUTS[key]?.label || '';
}
