import { useStore } from '@nanostores/solid';

import { openNickTagSelection } from '@/store/currentEquipDrawer';
import { $currentNickTagId } from '@/store/character/selector';
import { setCharacterNickTag } from '@/store/character/action';
import { SimpleEquipItem } from './SimpleEquipItem';

export const NickTagItem = () => {
  const nickTagId = useStore($currentNickTagId);

  function handleEdit() {
    openNickTagSelection();
  }

  function handleDelete() {
    setCharacterNickTag(undefined);
  }

  return (
    <SimpleEquipItem
      id={nickTagId()}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};
