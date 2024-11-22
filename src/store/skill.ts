import { atom, computed } from 'nanostores';

import { $apiHost } from './const';

export interface SkillItem {
  id: number;
  name: string;
  folder: string;
}

/* [id, folder, name] */
type SkillStringResponseItem = [string, string, string];

export const $skillStrings = atom<SkillItem[]>([]);
export const $skillSearch = atom<string>('');

export const $currentSkill = atom<SkillItem | null>(null);

/* computed */
export const $skillFilterdStrings = computed(
  [$skillStrings, $skillSearch],
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
        (item) =>
          item.id === idSearch ||
          item.name.includes(search) ||
          item.folder.includes(search),
      );
    }

    return strings.filter((item) => item.name.includes(search));
  },
);

export const $isChairUninitialized = computed(
  [$skillStrings],
  (strings) => strings.length === 0,
);

/* actions */
export async function prepareAndFetchChairStrings() {
  const strings = await fetch(`${$apiHost.get()}/string/skill`)
    .then((res) => res.json())
    .then((res: SkillStringResponseItem[]) =>
      res.map(
        ([id, folder, name]) =>
          ({
            id: Number.parseInt(id),
            name,
            folder,
          }) as SkillItem,
      ),
    );

  $skillStrings.set(strings);
}
