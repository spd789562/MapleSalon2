import { atom, computed, map } from 'nanostores';

import { $apiHost } from './const';

export interface MapItem {
  id: string;
  name: string;
  region: string;
}

/* [id, name, region] */
type MapStringResponseItem = [string, string, string];

export const $mapStrings = atom<MapItem[]>([]);
export const $mapSearch = atom<string>('');

export const $selectedMap = atom<MapItem | null>(null);
export const $currentMap = atom<MapItem | null>(null);

export const $mapOffsetX = atom(0);
export const $mapOffsetY = atom(0);

export const $mapOptions = map({});

/* computed */
export const $mapFilterdStrings = computed(
  [$mapStrings, $mapSearch],
  (strings, search) => {
    if (!search) {
      return strings;
    }
    if (search.includes(',')) {
      const ids = search
        .split(',')
        .filter((id) => !Number.isNaN(Number.parseInt(id)));
      return strings.filter((item) => ids.includes(item.id));
    }
    const idSearch = Number.parseInt(search);
    if (!Number.isNaN(idSearch)) {
      return strings.filter(
        (item) =>
          item.id.startsWith(search) ||
          item.region.includes(search) ||
          item.name.includes(search),
      );
    }

    return strings.filter(
      (item) => item.region.includes(search) || item.name.includes(search),
    );
  },
);
export const $isMapListUninitialized = computed(
  [$mapStrings],
  (strings) => strings.length === 0,
);
export const $isMapSubmitDisabled = computed(
  [$selectedMap, $currentMap],
  (map, currentMap) => !map || map.id === currentMap?.id,
);

/* actions */
export async function prepareAndFetchMapStrings() {
  const strings = await fetch(`${$apiHost.get()}/string/map`)
    .then((res) => res.json())
    .then((res: MapStringResponseItem[]) =>
      res.map(
        ([id, name, region]) =>
          ({
            id,
            region,
            name,
          }) as MapItem,
      ),
    );

  $mapStrings.set(strings);
}
export function submitMapSelection() {
  const map = $selectedMap.get();
  if (!map) {
    return;
  }
  $currentMap.set({ ...map });
}
