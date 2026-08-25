import { create } from 'zustand';

const uiStore = create((set) => ({
  activePanel: 'media', // media | audio | text | stickers | effects | filters | transitions | animation | ai
  activePropertiesTab: 'transform', // transform | adjust | animation | effects
  showExportModal: false,
  showCommandPalette: false,
  showSettings: false,
  showShortcuts: false,
  showContextMenu: false,
  contextMenu: { x: 0, y: 0, items: [] },
  showSafeArea: false,
  showGrid: false,
  showRulers: true,
  isMobile: false,
  mobileTab: 'edit', // edit | media | timeline | properties
  toasts: [],

  setActivePanel: (panel) => set({ activePanel: panel }),
  setActivePropertiesTab: (tab) => set({ activePropertiesTab: tab }),
  setExportModal: (show) => set({ showExportModal: show }),
  setCommandPalette: (show) => set({ showCommandPalette: show }),
  setSettings: (show) => set({ showSettings: show }),
  setShortcuts: (show) => set({ showShortcuts: show }),
  setContextMenu: (show, menu = null) =>
    set({ showContextMenu: show, contextMenu: menu || { x: 0, y: 0, items: [] } }),
  toggleSafeArea: () => set((s) => ({ showSafeArea: !s.showSafeArea })),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleRulers: () => set((s) => ({ showRulers: !s.showRulers })),
  setIsMobile: (isMobile) => set({ isMobile }),
  setMobileTab: (tab) => set({ mobileTab: tab }),

  addToast: (toast) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },

  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export default uiStore;
