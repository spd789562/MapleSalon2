import { useStore } from '@nanostores/solid';

import { $equipmentDrawerSearch } from '@/store/equipDrawer';

import { Input } from '@/components/ui/input';

export const EquipSearchInput = () => {
  const search = useStore($equipmentDrawerSearch);

  return (
    <Input
      size="sm"
      placeholder="Search..."
      value={search().All}
      onChange={(e) => $equipmentDrawerSearch.set({ All: e.target.value })}
    />
  );
};
