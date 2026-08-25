import { putItem, getItem, getAllItems, deleteItem } from './indexedDB';
import { uid } from '@/utils/time';

export async function saveMediaBlob(id, blob) {
  await putItem('media', { id, blob, createdAt: Date.now() });
}

export async function getMediaBlob(id) {
  return getItem('media', id);
}

export async function getAllMedia() {
  return getAllItems('media');
}

export async function deleteMedia(id) {
  return deleteItem('media', id);
}
