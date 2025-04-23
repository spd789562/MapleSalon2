import { atom, computed } from 'nanostores';

import { $apiHost } from './const';
import { $characterList } from './characterDrawer';
import { $currentCharacterId } from './character/selector';
import type { CharacterData } from './character/store';

export interface ChairItem {
  id: number;
  name: string;
  folder: string;
}

/* [id, folder, name] */
type ChairStringResponseItem = [string, string, string];

const $chairFetch = atom<Promise<void> | null>(null);

export const $chairStrings = atom<ChairItem[]>([]);
export const $chairSearch = atom<string>('');

export const $currentChair = atom<ChairItem | null>(null);
export const $otherCharacterIds = atom<string[]>([]);

export const $enableCharacterEffect = atom<boolean>(true);
export const $showCharacter = atom<boolean>(true);

/* computed */
export const $chairFilterdStrings = computed(
  [$chairStrings, $chairSearch],
  (strings, search) => {
    if (!search) {
      return strings;
    }
    if (search.includes(',')) {
      const ids = search
        .split(',')
        .map((id) => Number.parseInt(id))
        .filter((id) => !Number.isNaN(id));
      return strings.filter((item) => ids.includes(item.id));
    }
    const lowercasedSearch = search.toLowerCase();
    const idSearch = Number.parseInt(search);
    if (!Number.isNaN(idSearch)) {
      return strings.filter(
        (item) =>
          item.id === idSearch ||
          item.name.toLowerCase().includes(lowercasedSearch) ||
          item.folder.includes(search),
      );
    }

    return strings.filter((item) =>
      item.name.toLowerCase().includes(lowercasedSearch),
    );
  },
);
export const $otherCharacters = computed(
  [$otherCharacterIds, $characterList, $currentCharacterId],
  (ids, characters, currentId) => {
    return ids.map(
      (id) =>
        characters.find(
          (char) => char.id === id && id !== currentId,
        ) as Partial<CharacterData>,
    ) as Partial<CharacterData>[];
  },
);
export const $isChairUninitialized = computed(
  [$chairStrings],
  (strings) => strings.length === 0,
);

/* actions */

export async function fetchChairStrings() {
  const strings = await fetch(`${$apiHost.get()}/string/chair`)
    .then((res) => res.json())
    .then((res: ChairStringResponseItem[]) =>
      res.map(
        ([id, folder, name]) =>
          ({
            id: Number.parseInt(id),
            name,
            folder,
          }) as ChairItem,
      ),
    );

  $chairStrings.set(strings);
}
export function prepareAndFetchChairStrings() {
  const fetchPromise = $chairFetch.get();
  if (fetchPromise) {
    return fetchPromise;
  }

  const promise = fetchChairStrings();
  $chairFetch.set(promise);
  return promise;
}

export function selectChair(chair: ChairItem) {
  $currentChair.set({ ...chair });
}
export function removeCurrentChair() {
  $currentChair.set(null);
}

export function addOtherCharacterId(id: string) {
  const currentId = $otherCharacterIds.get();
  if (!currentId.includes(id)) {
    $otherCharacterIds.set([...currentId, id]);
  }
}
export function removeOtherCharacterId(id: string) {
  const currentId = $otherCharacterIds.get();
  $otherCharacterIds.set(currentId.filter((cId) => cId !== id));
}
