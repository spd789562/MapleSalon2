import { createUniqueId } from 'solid-js';
import { map, computed, atom, onSet } from 'nanostores';

import { Store } from '@tauri-apps/plugin-store';

import type { CharacterItems } from './character/store';
import { $previewCharacter } from './character/selector';
import { changeCurrentCharacter } from './character/action';
import { deepCloneCharacterItems } from './character/utils';

import { CharacterEarType } from '@/const/ears';
import { CharacterHandType } from '@/const/hand';
import { isValidEquipSubCategory } from '@/const/equipments';
import { isValidEarType } from '@/const/ears';
import { isValidHandType } from '@/const/hand';

const SAVE_FILENAME = 'character.bin';

const SAVE_CHARACTERS_KEY = 'characters';

const SAVE_PERIOD = 1000 * 60 * 20; // 20 minutes

const DEFAULT_CHARACTER: SaveCharacterData = {
  id: createCharacterUniqueId(),
  name: 'name',
  earType: CharacterEarType.HumanEar,
  handType: CharacterHandType.SingleHand,
  items: {
    Head: {
      id: 2000,
      name: '奶油皮膚',
    },
    Body: {
      id: 12000,
      name: '奶油皮膚',
    },
  },
};

export interface SaveCharacterInfo {
  id: string;
  name: string;
  earType: CharacterEarType;
  handType: CharacterHandType;
}

export interface SaveCharacterData extends SaveCharacterInfo {
  items: Partial<CharacterItems>;
}

/** character's save, a presistence store on file */
export const fileStore = new Store(SAVE_FILENAME);

export const $savedCharacter = map<(SaveCharacterData | undefined)[]>([]);
export const $lastSave = atom<number>(-1);

/* effect */
onSet($savedCharacter, async () => {
  if ($lastSave.get() + SAVE_PERIOD < Date.now()) {
    await fileStore.save();
    $lastSave.set(Date.now());
  }
});

/* computed */
export const $characterList = computed($savedCharacter, (characters) => {
  return Array.from(Object.values(characters)) as SaveCharacterData[];
});
export function createGetCharacterById(id: string) {
  return computed($characterList, (characters) => {
    return characters.find((character) => {
      return character?.id === id;
    });
  });
}
export const $getCharacterIds = computed($characterList, (characters) => {
  return characters
    .map((character) => {
      return character?.id;
    })
    .filter(Boolean) as string[];
});

/* actions */
export async function initializeSavedCharacter() {
  try {
    const datas =
      await fileStore.get<Record<string, SaveCharacterData>>(
        SAVE_CHARACTERS_KEY,
      );
    const validCharacters: SaveCharacterData[] = [];
    if (datas) {
      for (const [key, value] of Object.entries(datas)) {
        const index = Number.parseInt(key);
        if (!Number.isNaN(index) && verifySaveCharacterData(value)) {
          validCharacters.push(value);
        }
      }
    }
    if (validCharacters.length === 0) {
      validCharacters.push(DEFAULT_CHARACTER);
    }
    $savedCharacter.set(validCharacters);
  } catch (e) {
    console.error('initializeSavedCharacter failed', e);
  }
}
export async function clearAllCharacters() {
  $savedCharacter.set([]);
  await fileStore.set(SAVE_CHARACTERS_KEY, {});
}
export async function appendCharacter(data: SaveCharacterData) {
  const currentCharacters = $characterList.get();
  $savedCharacter.setKey(currentCharacters.length, data);
  await fileStore.set(SAVE_CHARACTERS_KEY, $savedCharacter.get());
}
export async function appendDefaultCharacter() {
  await appendCharacter({
    ...DEFAULT_CHARACTER,
    id: createCharacterUniqueId(),
  });
}
export async function saveCharacter(data: SaveCharacterData) {
  const currentCharacters = $characterList.get();
  const existIndex = currentCharacters.findIndex((character) => {
    return character?.id === data.id;
  });
  if (existIndex === -1) {
    await appendCharacter(data);
  } else {
    $savedCharacter.setKey(existIndex, data);
    await fileStore.set(SAVE_CHARACTERS_KEY, $savedCharacter.get());
  }
}
export async function removeCharacter(id: string) {
  const currentCharacters = $characterList.get();
  const existIndex = currentCharacters.findIndex((character) => {
    return character?.id === id;
  });
  if (existIndex !== -1) {
    $savedCharacter.set(
      currentCharacters.filter((character) => {
        return character?.id !== id;
      }),
    );
    await fileStore.set(SAVE_CHARACTERS_KEY, $savedCharacter.get());
  }
}
export async function cloneCharacter(id: string) {
  const currentCharacters = $characterList.get();
  const existIndex = currentCharacters.findIndex((character) => {
    return character?.id === id;
  });
  if (existIndex === -1) {
    return;
  }
  const character = {
    ...currentCharacters[existIndex],
    items: deepCloneCharacterItems(currentCharacters[existIndex].items),
    id: createCharacterUniqueId(),
  } as SaveCharacterData;
  // clone to next index
  const newCharacters = [
    ...currentCharacters.slice(0, existIndex + 1),
    character,
    ...currentCharacters.slice(existIndex + 1),
  ];
  $savedCharacter.set(newCharacters);
  await fileStore.set(SAVE_CHARACTERS_KEY, newCharacters);

  // clone to last index
  // $savedCharacter.setKey(currentCharacters.length, character);
}
export function saveCurrentCharacter(newId?: boolean) {
  const currentCharacter = $previewCharacter.get();
  const id =
    newId || !currentCharacter.id
      ? createCharacterUniqueId()
      : currentCharacter.id;
  const data: SaveCharacterData = {
    id,
    name: currentCharacter.name || 'name',
    earType: currentCharacter.earType,
    handType: currentCharacter.handType,
    items: currentCharacter.items,
  };
  return saveCharacter(data);
}

/* utils */
export function createCharacterUniqueId() {
  return `${createUniqueId()}-${Date.now()}`;
}
export function selectCharacter(character: SaveCharacterData) {
  changeCurrentCharacter(character as Partial<CharacterData>);
}
export function verifyItems(items: Partial<CharacterItems>) {
  for (const [key, item] of Object.entries(items)) {
    if (!isValidEquipSubCategory(key)) {
      return false;
    }
    if (!item.id) {
      return false;
    }
  }
  return true;
}
export function verifySaveCharacterData(data: SaveCharacterData) {
  return (
    isValidEarType(data.earType) &&
    isValidHandType(data.handType) &&
    verifyItems(data.items)
  );
}
