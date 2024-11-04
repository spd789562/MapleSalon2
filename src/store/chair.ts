import { atom, computed } from 'nanostores';

import { $apiHost } from './const';
import { $characterList } from './characterDrawer';
import type { CharacterData } from './character/store';

export interface ChairItem {
  id: number;
  name: string;
  folder: string;
}

/* [id, folder, name] */
type ChairStringResponseItem = [string, string, string];

export const $chairStrings = atom<ChairItem[]>([]);
export const $chairSearch = atom<string>('');

export const $currentChair = atom<ChairItem | null>(null);
export const $otherCharacterIds = atom<string[]>([]);

/* computed */
export const $chairFilterdStrings = computed(
  [$chairStrings, $chairSearch],
  (strings, search) => {
    if (!search) {
      return strings;
    }
    const idSearch = Number.parseInt(search);
    if (!Number.isNaN(idSearch)) {
      return strings.filter(
        (item) => item.id === idSearch || item.name.includes(search),
      );
    }
    return strings.filter((item) => item.name.includes(search));
  },
);
export const $otherCharacters = computed(
  [$otherCharacterIds, $characterList],
  (ids, characters) => {
    return characters.filter((character) =>
      ids.includes(character.id),
    ) as Partial<CharacterData>[];
  },
);
export const $isChairUninitialized = computed(
  [$chairStrings],
  (strings) => strings.length === 0,
);

/* actions */
export async function prepareAndFetchChairStrings() {
  await fetch(`${$apiHost.get()}/node/load_extra_paths?path=Item`);
  const strings = await fetch(`${$apiHost.get()}/string/chair?cache=14400`)
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
