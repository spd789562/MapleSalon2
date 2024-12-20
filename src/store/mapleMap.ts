import { atom, computed, type WritableAtom } from 'nanostores';

import { $currentScene } from '@/store/scene';
import { $apiHost } from '@/store/const';

import { PreviewScene } from '@/const/scene';

const MAX_SELECTION = 5;

export interface MapItem {
  id: string;
  name: string;
  region: string;
}

export interface TagItem {
  name: string;
  disabled: boolean;
}

/* [id, name, region] */
type MapStringResponseItem = [string, string, string];

export const $isMapLoading = atom(false);
export const $mapStrings = atom<MapItem[]>([]);
export const $mapSearch = atom<string>('');
export const $mapListLastOffset = atom(0);

export const $selectedMap = atom<MapItem | null>(null);
export const $currentMap = atom<MapItem | null>(null);
export const $selectMapHistory = atom<MapItem[]>([]);

export const $currentMapRect = atom({ x: 0, y: 0, width: 0, height: 0 });

export const $mapTargetLayer = atom(6);
export const $mapTargetPosX = atom(0);
export const $mapTargetPosY = atom(0);
export const $mapOffsetX = atom(0);
export const $mapOffsetY = atom(0);

export const $mapTags = atom<TagItem[]>([]);
export const $mapBackgroundTags = atom<TagItem[]>([]);
const mapLayers = [
  'background',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  'foreground',
  'particle',
];
export const $mapLayerTags = atom<TagItem[]>(
  mapLayers.map((name) => ({ name, disabled: false })),
);

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
export const $disabledLayers = computed([$mapLayerTags], (tags) =>
  tags.filter((tag) => tag.disabled).map((tag) => tag.name),
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
  appendMapSelection({ ...map });
  updateCurrentMap(map);
}
export function updateCurrentMap(map: MapItem) {
  $currentMap.set({ ...map });
  $mapTargetPosX.set(0);
  $mapTargetPosY.set(0);
  if ($currentScene.get() !== PreviewScene.MapleMap) {
    $currentScene.set(PreviewScene.MapleMap);
  }
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
export function updateMapTags(target: WritableAtom<TagItem[]>, tags: string[]) {
  target.set(
    tags.map((name) => ({
      name,
      disabled: false,
    })),
  );
}
export function toggleMapTag(target: WritableAtom<TagItem[]>, name: string) {
  const tags = target.get();
  target.set(
    tags.map((tag) =>
      tag.name === name ? { ...tag, disabled: !tag.disabled } : tag,
    ),
  );
}

export function appendMapSelection(map: MapItem) {
  const list = $selectMapHistory.get();
  if (list.length >= MAX_SELECTION) {
    list.pop();
  }
  $selectMapHistory.set([map, ...list]);
}
