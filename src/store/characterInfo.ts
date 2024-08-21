import { atom } from 'nanostores';

import type { SaveCharacterData } from '@/store/characterDrawer';

export const $currentCharacterInfo = atom<SaveCharacterData | null>(null);

export function changeCurrentCharacterInfo(character: SaveCharacterData) {
  $currentCharacterInfo.set(character);
}
export function clearCurrentCharacterInfo() {
  $currentCharacterInfo.set(null);
}
