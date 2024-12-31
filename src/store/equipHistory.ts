import { atom } from 'nanostores';
import { load } from '@tauri-apps/plugin-store';

import type { EquipItem } from './string';
import { EquipCategory } from '@/const/equipments';

const MAX_HISTORY_SIZE = 200;

const SAVE_FILENAME = 'selectHistory.bin';

const SAVE_KEY = 'history';

/** file selection save, a presistence store on file */
export const fileStore = await load(SAVE_FILENAME);

/** items recently select */
export const $equipmentHistory = atom<EquipItem[]>([]);

export async function initializeSavedEquipmentHistory() {
  const history = await fileStore.get<EquipItem[] | undefined>(SAVE_KEY);
  if (history && Array.isArray(history) && history.length > 0) {
    const verifiedHistory = history
      .map(validateEquipItem)
      .filter(Boolean) as EquipItem[];
    $equipmentHistory.set(verifiedHistory);
  }
}

export function appendHistory(item: EquipItem) {
  const current = $equipmentHistory.get().filter((e) => e.id !== item.id);
  const history = [item, ...current];
  if (history.length > MAX_HISTORY_SIZE) {
    $equipmentHistory.set(history.slice(0, MAX_HISTORY_SIZE));
  } else {
    $equipmentHistory.set(history);
  }
  try {
    fileStore.set(SAVE_KEY, history);
  } catch (_) {
    console.error('Failed to save history');
  }
}

export function saveHistory() {
  return fileStore.save();
}

/* util */
function validateEquipItem(item: EquipItem) {
  const returnItem = {} as EquipItem;
  if (!item) {
    return;
  }
  if (!item.id || typeof item.id !== 'number') {
    return;
  }
  returnItem.id = item.id;
  if (!item.name || typeof item.name !== 'string') {
    return;
  }
  returnItem.name = item.name;
  if (item.hasEffect) {
    returnItem.hasEffect = !!item.hasEffect;
  }
  if (item.isDyeable) {
    returnItem.isDyeable = !!item.isDyeable;
  }
  returnItem.category = returnItem.category ?? EquipCategory.Unknown;
  if (item.isNameTag) {
    returnItem.category = EquipCategory.NameTag;
  }
  if (item.isChatBalloon) {
    returnItem.category = EquipCategory.ChatBalloon;
  }

  return returnItem;
}
