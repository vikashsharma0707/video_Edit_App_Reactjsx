import { uid } from '@/utils/time';
import { putItem, getAllItems, deleteItem } from '@/services/storage/indexedDB';

export async function saveExportRecord(record) {
  const item = { id: uid(), ...record, createdAt: Date.now() };
  await putItem('exports', item);
  return item;
}

export async function getExportHistory() {
  const records = await getAllItems('exports');
  return records.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteExportRecord(id) {
  return deleteItem('exports', id);
}
