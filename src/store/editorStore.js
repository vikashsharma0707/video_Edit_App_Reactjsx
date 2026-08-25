import { create } from 'zustand';
import { uid } from '@/utils/time';
import { createProject } from '@/utils/project';

const MAX_HISTORY = 50;

const editorStore = create((set, get) => ({
  project: null,
  selectedClipId: null,
  selectedLayerId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  playbackRate: 1,
  zoom: 50, // pixels per second
  history: [],
  redoStack: [],
  clipboard: null,
  snapEnabled: true,
  snapTime: null,

  setProject: (project) => {
    const duration = project.clips.reduce(
      (max, c) => Math.max(max, c.start + c.duration),
      0
    );
    set({ project, duration, currentTime: 0, isPlaying: false, history: [], redoStack: [] });
  },

  updateProject: (updater, recordHistory = true) => {
    set((state) => {
      const newProject = typeof updater === 'function' ? updater(state.project) : { ...state.project, ...updater };
      const updated = { ...newProject, updatedAt: Date.now() };
      const newDuration = updated.clips.reduce(
        (max, c) => Math.max(max, c.start + c.duration),
        0
      );
      const historyEntry = recordHistory ? { project: state.project, time: Date.now() } : null;
      return {
        project: updated,
        duration: newDuration,
        history: historyEntry ? [...state.history, historyEntry].slice(-MAX_HISTORY) : state.history,
        redoStack: recordHistory ? [] : state.redoStack,
      };
    });
  },

  setCurrentTime: (time) => set({ currentTime: Math.max(0, time) }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setZoom: (zoom) => set({ zoom: Math.max(5, Math.min(500, zoom)) }),
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  setSnapTime: (time) => set({ snapTime: time }),

  selectClip: (clipId) => set({ selectedClipId: clipId, selectedLayerId: clipId }),
  clearSelection: () => set({ selectedClipId: null, selectedLayerId: null }),

  setClipboard: (clip) => set({ clipboard: clip }),

  // Clip operations
  addClip: (clip) => {
    get().updateProject((p) => ({
      ...p,
      clips: [...p.clips, { ...clip, id: clip.id || uid() }],
    }));
    set({ selectedClipId: clip.id || null });
  },

  updateClip: (clipId, updates, recordHistory = true) => {
    get().updateProject(
      (p) => ({
        ...p,
        clips: p.clips.map((c) => (c.id === clipId ? { ...c, ...updates } : c)),
      }),
      recordHistory
    );
  },

  updateClipTransform: (clipId, transform) => {
    get().updateProject((p) => ({
      ...p,
      clips: p.clips.map((c) =>
        c.id === clipId ? { ...c, transform: { ...c.transform, ...transform } } : c
      ),
    }));
  },

  deleteClip: (clipId) => {
    get().updateProject((p) => ({
      ...p,
      clips: p.clips.filter((c) => c.id !== clipId),
    }));
    if (get().selectedClipId === clipId) set({ selectedClipId: null, selectedLayerId: null });
  },

  duplicateClip: (clipId) => {
    const state = get();
    const clip = state.project?.clips.find((c) => c.id === clipId);
    if (!clip) return;
    const newClip = {
      ...clip,
      id: uid(),
      start: clip.start + clip.duration,
    };
    get().addClip(newClip);
  },

  splitClip: (clipId, splitTime) => {
    const state = get();
    const clip = state.project?.clips.find((c) => c.id === clipId);
    if (!clip) return;
    if (splitTime <= clip.start || splitTime >= clip.start + clip.duration) return;

    const firstDuration = splitTime - clip.start;
    const secondDuration = clip.duration - firstDuration;
    const speed = clip.speed || 1;

    const first = {
      ...clip,
      duration: firstDuration,
      sourceEnd: (clip.sourceStart || 0) + firstDuration * speed,
    };
    const second = {
      ...clip,
      id: uid(),
      start: splitTime,
      duration: secondDuration,
      sourceStart: (clip.sourceStart || 0) + firstDuration * speed,
    };

    get().updateProject((p) => ({
      ...p,
      clips: [...p.clips.filter((c) => c.id !== clipId), first, second],
    }));
  },

  moveClip: (clipId, newStart) => {
    const state = get();
    const clip = state.project?.clips.find((c) => c.id === clipId);
    if (!clip) return;
    get().updateClip(clipId, { start: Math.max(0, newStart) });
  },

  trimClip: (clipId, side, newTime) => {
    const state = get();
    const clip = state.project?.clips.find((c) => c.id === clipId);
    if (!clip) return;
    const speed = clip.speed || 1;

    if (side === 'left') {
      const delta = newTime - clip.start;
      const newDuration = clip.duration - delta;
      if (newDuration < 0.1) return;
      get().updateClip(clipId, {
        start: newTime,
        duration: newDuration,
        sourceStart: (clip.sourceStart || 0) + delta * speed,
      });
    } else {
      const newDuration = newTime - clip.start;
      if (newDuration < 0.1) return;
      get().updateClip(clipId, {
        duration: newDuration,
        sourceEnd: (clip.sourceStart || 0) + newDuration * speed,
      });
    }
  },

  // Track operations
  addTrack: (type) => {
    const id = `track_${type}_${uid().slice(-4)}`;
    get().updateProject((p) => ({
      ...p,
      tracks: [
        ...p.tracks,
        { id, type, name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${p.tracks.filter((t) => t.type === type).length + 1}`, muted: false, locked: false, visible: true, collapsed: false },
      ],
    }));
  },

  updateTrack: (trackId, updates) => {
    get().updateProject((p) => ({
      ...p,
      tracks: p.tracks.map((t) => (t.id === trackId ? { ...t, ...updates } : t)),
    }));
  },

  deleteTrack: (trackId) => {
    get().updateProject((p) => ({
      ...p,
      tracks: p.tracks.filter((t) => t.id !== trackId),
      clips: p.clips.filter((c) => c.trackId !== trackId),
    }));
    if (get().selectedClipId && !get().project?.clips.find((c) => c.id === get().selectedClipId)) {
      set({ selectedClipId: null });
    }
  },

  // Undo / Redo
  undo: () => {
    const { history, redoStack, project } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      project: previous.project,
      duration: previous.project.clips.reduce((max, c) => Math.max(max, c.start + c.duration), 0),
      history: history.slice(0, -1),
      redoStack: [...redoStack, { project, time: Date.now() }].slice(-MAX_HISTORY),
      selectedClipId: null,
    });
  },

  redo: () => {
    const { redoStack, history, project } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set({
      project: next.project,
      duration: next.project.clips.reduce((max, c) => Math.max(max, c.start + c.duration), 0),
      redoStack: redoStack.slice(0, -1),
      history: [...history, { project, time: Date.now() }].slice(-MAX_HISTORY),
      selectedClipId: null,
    });
  },

  canUndo: () => get().history.length > 0,
  canRedo: () => get().redoStack.length > 0,

  // Layer ordering
  bringForward: (clipId) => {
    get().updateProject((p) => {
      const clips = [...p.clips];
      const idx = clips.findIndex((c) => c.id === clipId);
      if (idx === -1 || idx === clips.length - 1) return p;
      [clips[idx], clips[idx + 1]] = [clips[idx + 1], clips[idx]];
      return { ...p, clips };
    });
  },

  sendBackward: (clipId) => {
    get().updateProject((p) => {
      const clips = [...p.clips];
      const idx = clips.findIndex((c) => c.id === clipId);
      if (idx <= 0) return p;
      [clips[idx], clips[idx - 1]] = [clips[idx - 1], clips[idx]];
      return { ...p, clips };
    });
  },

  bringToFront: (clipId) => {
    get().updateProject((p) => {
      const clip = p.clips.find((c) => c.id === clipId);
      if (!clip) return p;
      return { ...p, clips: [...p.clips.filter((c) => c.id !== clipId), clip] };
    });
  },

  sendToBack: (clipId) => {
    get().updateProject((p) => {
      const clip = p.clips.find((c) => c.id === clipId);
      if (!clip) return p;
      return { ...p, clips: [clip, ...p.clips.filter((c) => c.id !== clipId)] };
    });
  },

  reset: () => {
    set({
      project: null,
      selectedClipId: null,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      history: [],
      redoStack: [],
    });
  },
}));

export default editorStore;
