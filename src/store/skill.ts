import { atom, computed } from 'nanostores';

import { $apiHost } from './const';

export interface SkillItem {
  id: string;
  name: string;
  folder: string;
}

/* [id, folder, name] */
type SkillStringResponseItem = [string, string, string];

const $skillFetch = atom<Promise<void> | null>(null);

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
        .filter((id) => Number.isInteger(Number.parseInt(id)));
      return strings.filter((item) => ids.includes(item.id));
    }
    const lowercasedSearch = search.toLowerCase();
    const idSearch = Number.parseInt(search);
    if (!Number.isNaN(idSearch)) {
      return strings.filter(
        (item) =>
          item.id === search ||
          item.name.toLowerCase().includes(lowercasedSearch) ||
          item.folder.includes(search),
      );
    }

    return strings.filter((item) =>
      item.name.toLowerCase().includes(lowercasedSearch),
    );
  },
);

export const $isSkillUninitialized = computed(
  [$skillStrings],
  (strings) => strings.length === 0,
);

/* actions */
export async function fetchSkillStrings() {
  const strings = await fetch(`${$apiHost.get()}/string/skill`)
    .then((res) => res.json())
    .then((res: SkillStringResponseItem[]) =>
      res.map(
        ([id, folder, name]) =>
          ({
            id,
            name,
            folder,
          }) as SkillItem,
      ),
    );

  $skillStrings.set(strings);
}
export function prepareAndFetchSkillStrings() {
  const fetchPromise = $skillFetch.get();
  if (fetchPromise) {
    return fetchPromise;
  }

  const promise = fetchSkillStrings();
  $skillFetch.set(promise);
  return promise;
}

export function selectSkill(skill: SkillItem) {
  $currentSkill.set({ ...skill });
}
