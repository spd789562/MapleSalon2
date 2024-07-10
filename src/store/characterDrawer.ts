import { createUniqueId } from 'solid-js';
import { map, atom } from 'nanostores';

import { Store } from '@tauri-apps/plugin-store';

import type { CharacterItems } from './character';
import type { CharacterEarType } from '@/const/ears';
import type { CharacterHandType } from '@/const/hand';

import { isValidEarType } from '@/const/ears';
import { isValidHandType } from '@/const/hand';

const SAVE_FILENAME = 'character.bin';

const SAVE_CHARACTERS_KEY = 'characters';

export interface SaveCharacterInfo {
  id: string;
  earType: CharacterEarType;
  handType: CharacterHandType;
}

export interface SaveCharacterData extends SaveCharacterInfo {
  items: Partial<CharacterItems>;
}

/** character's save, a presistence store on file */
export const fileStore = new Store(SAVE_FILENAME);

export const $savedCharacter = map<(SaveCharacterData | undefined)[]>([]);

/* actions */
export async function initializeSavedCharacter() {
  try {
    const datas = await fileStore.get<SaveCharacterData[]>(SAVE_CHARACTERS_KEY);
    if (datas) {
      $savedCharacter.set(
        datas.filter((character) => {
          return verifySaveCharacterData(character);
        }),
      );
    }
  } catch (e) {
    console.error('initializeSavedCharacter failed', e);
  }
}
export async function saveCharacter(data: SaveCharacterData) {
  const currentCharacters = $savedCharacter.get();
  const existIndex = currentCharacters.findIndex((character) => {
    return character?.id === data.id;
  });
  if (existIndex === -1) {
    $savedCharacter.setKey(currentCharacters.length, data);
  } else {
    $savedCharacter.setKey(existIndex, data);
  }
  await fileStore.set(SAVE_CHARACTERS_KEY, $savedCharacter.get());
}
export async function removeCharacter(id: string) {
  const currentCharacters = $savedCharacter.get();
  const existIndex = currentCharacters.findIndex((character) => {
    return character?.id === id;
  });
  if (existIndex !== -1) {
    $savedCharacter.setKey(existIndex, undefined);
    await fileStore.set(SAVE_CHARACTERS_KEY, $savedCharacter.get());
  }
}
export async function cloneCharacter(id: string) {
  const currentCharacters = $savedCharacter.get();
  const existIndex = currentCharacters.findIndex((character) => {
    return character?.id === id;
  });
  if (existIndex !== -1) {
    return;
  }
  const character = currentCharacters[existIndex] as SaveCharacterData;
  character.id = createUniqueId();
  // clone to next index
  const newCharacters = [
    ...currentCharacters.slice(0, existIndex),
    character,
    ...currentCharacters.slice(existIndex),
  ];
  $savedCharacter.set(newCharacters);
  await fileStore.set(SAVE_CHARACTERS_KEY, newCharacters);

  // clone to last index
  // $savedCharacter.setKey(currentCharacters.length, character);
}

/* utils */
function verifySaveCharacterData(data: SaveCharacterData) {
  return isValidEarType(data.earType) && isValidHandType(data.handType);
}
