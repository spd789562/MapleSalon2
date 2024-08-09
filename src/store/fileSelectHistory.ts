import { map } from 'nanostores';

import { Store } from '@tauri-apps/plugin-store';

const SAVE_FILENAME = 'path.bin';

const SAVE_KEY = 'filepaths';

/** file selection save, a presistence store on file */
export const fileStore = new Store(SAVE_FILENAME);

export const $savedFileSelectHistory = map<string[]>([]);

export async function initializeSavedFileSelectHistory() {
  const history = await fileStore.get<string[] | undefined>(SAVE_KEY);
  if (history && history.length > 0) {
    /* prevent weird data in it */
    const verifiedHistory = history.filter(
      (path) => typeof path === 'string' && path.endsWith('Base.wz'),
    );
    $savedFileSelectHistory.set(verifiedHistory);
  }
}

export async function appendPathToHistory(filePath: string) {
  const history = $savedFileSelectHistory.get();
  if (history.includes(filePath)) {
    return;
  }
  const newHistory = [...history, filePath];
  $savedFileSelectHistory.set(newHistory);
  await fileStore.set(SAVE_KEY, newHistory);
  await fileStore.save();
}

export async function removePathFromHistory(filePath: string) {
  const history = $savedFileSelectHistory.get();
  const newHistory = history.filter((path) => path !== filePath);
  $savedFileSelectHistory.set(newHistory);
  await fileStore.set(SAVE_KEY, newHistory);
  await fileStore.save();
}

export async function clearFileSelectHistory() {
  $savedFileSelectHistory.set([]);
  await fileStore.set(SAVE_KEY, []);
  await fileStore.save();
}
