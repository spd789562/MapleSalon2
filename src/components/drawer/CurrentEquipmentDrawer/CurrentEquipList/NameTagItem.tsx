import { useStore } from '@nanostores/solid';

import { openNameTagSelection } from '@/store/currentEquipDrawer';
import { $currentNameTagId } from '@/store/character/selector';
import { setCharacterNameTag } from '@/store/character/action';
import { SimpleEquipItem } from './SimpleEquipItem';

export const NameTagItem = () => {
  const nameTagId = useStore($currentNameTagId);

  function handleEdit() {
    openNameTagSelection();
  }

  function handleDelete() {
    setCharacterNameTag(undefined);
  }

  return (
    <SimpleEquipItem
      id={nameTagId()}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};
