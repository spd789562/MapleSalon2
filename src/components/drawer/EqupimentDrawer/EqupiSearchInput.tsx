import { useStore } from '@nanostores/solid';

import {
  $equipmentDrawerSearch,
  $equipmentDrawerEquipCategory,
} from '@/store/equipDrawer';

import { Input } from '@/components/ui/input';

import { debounce } from 'throttle-debounce';

export const EquipSearchInput = () => {
  const search = useStore($equipmentDrawerSearch);

  const handleSearch = debounce(300, (value: string) => {
    $equipmentDrawerSearch.setKey($equipmentDrawerEquipCategory.get(), value);
  });

  return (
    <Input
      size="sm"
      placeholder="Search..."
      value={search().All}
      onInput={(e) => handleSearch(e.target.value)}
    />
  );
};
