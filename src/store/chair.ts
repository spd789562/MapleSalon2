import { atom, computed } from 'nanostores';

import { $apiHost } from './const';

// import { nextTick } from '@/utils/eventLoop';

export interface ChairItem {
  id: number;
  name: string;
  folder: string;
}

/* [id, folder, name] */
type ChairStringResponseItem = [string, string, string];

export const $chairStrings = atom<ChairItem[]>([]);
export const $chairSearch = atom<string>('');

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

/* actions */
export async function prepareAndFetchChairStrings() {
  await fetch(`${$apiHost.get()}/node/load_extra_paths?path=Item`);
  const strings = await fetch(`${$apiHost.get()}/string/chair?cache=14400`)
    .then((res) => res.json())
    .then((res: ChairStringResponseItem[]) =>
      res.map(
        ([id, name, folder]) =>
          ({
            id: Number.parseInt(id),
            name,
            folder,
          }) as ChairItem,
      ),
    );

  $chairStrings.set(strings);
}
