import { atom, computed } from 'nanostores';

import { $apiHost } from './const';
import { CharacterAction } from '@/const/actions';

export interface MountItem {
  id: number;
  name: string;
}

/* [id, name] */
type MountStringResponseItem = [string, string];

export const $mountStrings = atom<MountItem[]>([]);
export const $mountAction = atom<string>(CharacterAction.Stand1);
export const $mountSearch = atom<string>('');

export const $currentMount = atom<MountItem | null>(null);

/* computed */
export const $mountFilterdStrings = computed(
  [$mountStrings, $mountSearch],
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
    const idSearch = Number.parseInt(search);
    if (!Number.isNaN(idSearch)) {
      return strings.filter(
        (item) => item.id === idSearch || item.name.includes(search),
      );
    }

    return strings.filter((item) => item.name.includes(search));
  },
);
export const $isMountUninitialized = computed(
  [$mountStrings],
  (strings) => strings.length === 0,
);

/* actions */
export async function prepareAndFetchMountStrings() {
  const strings = await fetch(`${$apiHost.get()}/string/mount`)
    .then((res) => res.json())
    .then((res: MountStringResponseItem[]) =>
      res.map(
        ([id, name]) =>
          ({
            id: Number.parseInt(id),
            name,
          }) as MountItem,
      ),
    );

  $mountStrings.set(strings);
}

export function selectMount(mount: MountItem) {
  $currentMount.set({ ...mount });
  /* reset the mount action */
  $mountAction.set(CharacterAction.Stand1);
}
export function removeCurrentMount() {
  $currentMount.set(null);
}
export function setMountAction(action: string) {
  $mountAction.set(action);
}
