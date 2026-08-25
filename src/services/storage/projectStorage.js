import { putItem, getItem, getAllItems, deleteItem } from './indexedDB';

export async function saveProject(project) {
  const toSave = {
    ...project,
    updatedAt: Date.now(),
  };
  // Don't store blob URLs (they're ephemeral)
  const cleanMedia = (project.media || []).map((m) => ({
    ...m,
    url: undefined,
    file: undefined,
  }));
  toSave.media = cleanMedia;
  await putItem('projects', toSave);
  return toSave;
}

export async function loadProject(id) {
  return getItem('projects', id);
}

export async function loadProjects() {
  const projects = await getAllItems('projects');
  return projects.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function deleteProject(id) {
  return deleteItem('projects', id);
}
