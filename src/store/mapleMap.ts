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
export const $currentMapRect = atom({ x: 0, y: 0, width: 0, height: 0 });

export const $mapTargetLayer = atom(6);
export const $mapTargetPosX = atom(0);
export const $mapTargetPosY = atom(0);
export const $mapOffsetX = atom(0);
export const $mapOffsetY = atom(0);

export const $mapTags = atom<
  {
    name: string;
    disabled: boolean;
  }[]
>([]);
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
  $mapTargetPosX.set(0);
  $mapTargetPosY.set(0);
}
export function updateMapRect(rect: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  $currentMapRect.set(rect);
}
export function updateMapTargetPos(x: number, y: number) {
  $mapTargetPosX.set(x);
  $mapTargetPosY.set(y);
}
export function updateMapTags(tags: string[]) {
  $mapTags.set(
    tags.map((name) => ({
      name,
      disabled: false,
    })),
  );
}
export function toggleMapTag(name: string) {
  const tags = $mapTags.get();
  $mapTags.set(
    tags.map((tag) =>
      tag.name === name ? { ...tag, disabled: !tag.disabled } : tag,
    ),
  );
}
