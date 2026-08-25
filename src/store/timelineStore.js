import { create } from 'zustand';

const timelineStore = create((set) => ({
  pixelsPerSecond: 50,
  scrollX: 0,
  scrollY: 0,
  snapEnabled: true,
  snapTime: null,
  isDragging: false,
  dragType: null,
  draggingClipId: null,
  dragStartX: 0,
  dragStartStart: 0,
  isResizing: false,
  resizeSide: null,
  isPlayheadDragging: false,
  rulerInterval: 5,

  setPixelsPerSecond: (pps) => set({ pixelsPerSecond: pps }),
  setScroll: (x, y) => set({ scrollX: x, scrollY: y }),
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  setSnapTime: (time) => set({ snapTime: time }),
  setDragging: (isDragging, dragType = null, clipId = null, startX = 0, startStart = 0) =>
    set({ isDragging, dragType, draggingClipId: clipId, dragStartX: startX, dragStartStart: startStart }),
  setResizing: (isResizing, side = null) => set({ isResizing, resizeSide: side }),
  setPlayheadDragging: (isDragging) => set({ isPlayheadDragging: isDragging }),
  setRulerInterval: (interval) => set({ rulerInterval: interval }),
}));

export default timelineStore;
