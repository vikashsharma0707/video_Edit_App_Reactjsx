import { create } from 'zustand';
import { uid } from '@/utils/time';
import { createProject, createDemoProject } from '@/utils/project';
import { saveProject, loadProjects, deleteProject as deleteProjectDB } from '@/services/storage/projectStorage';

const projectStore = create((set, get) => ({
  projects: [],
  loading: false,
  currentProjectId: null,
  saveStatus: 'idle', // idle | saving | saved | unsaved

  loadProjects: async () => {
    set({ loading: true });
    try {
      const projects = await loadProjects();
      set({ projects, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createProject: async (name = 'Untitled Project', aspectRatio = '16:9') => {
    const project = createProject(name, aspectRatio);
    await saveProject(project);
    set((state) => ({
      projects: [project, ...state.projects],
      currentProjectId: project.id,
    }));
    return project;
  },

  createDemoProject: async () => {
    const project = createDemoProject();
    await saveProject(project);
    set((state) => ({
      projects: [project, ...state.projects],
      currentProjectId: project.id,
    }));
    return project;
  },

  openProject: (id) => {
    set({ currentProjectId: id });
  },

  saveProject: async (project) => {
    set({ saveStatus: 'saving' });
    try {
      const updated = { ...project, updatedAt: Date.now() };
      await saveProject(updated);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
        saveStatus: 'saved',
      }));
      setTimeout(() => set({ saveStatus: 'idle' }), 2000);
      return updated;
    } catch {
      set({ saveStatus: 'idle' });
      return project;
    }
  },

  deleteProject: async (id) => {
    await deleteProjectDB(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },

  duplicateProject: async (id) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) return;
    const copy = {
      ...JSON.parse(JSON.stringify(project)),
      id: uid(),
      name: `${project.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveProject(copy);
    set((state) => ({ projects: [copy, ...state.projects] }));
    return copy;
  },

  renameProject: async (id, name) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) return;
    const updated = { ...project, name, updatedAt: Date.now() };
    await saveProject(updated);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
    }));
  },

  setSaveStatus: (status) => set({ saveStatus: status }),
}));

export default projectStore;
