import { invoke } from '@tauri-apps/api/core';

import { debounce } from 'throttle-debounce';

export const ItemNameSearch = () => {
  const debouncedSearch = debounce(300, async (value: string) => {
    if (value.length > 1) {
      const result = await invoke('search_by_equip_name', { name: value });
      /* currently only do print in console */
      console.info('[ItemNameSearch] result:', result);
    }
  });

  return (
    <label for="item-search">
      Item Name Search:
      <input
        id="item-search"
        type="text"
        onInput={(e) => debouncedSearch(e.target.value)}
        autocomplete="off"
      />
    </label>
  );
};
