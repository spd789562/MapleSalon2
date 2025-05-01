import { useStore } from '@nanostores/solid';

import { openMedalSelection } from '@/store/currentEquipDrawer';
import { $currentMedalId } from '@/store/character/selector';
import { setCharacterMedal } from '@/store/character/action';
import { SimpleEquipItem } from './SimpleEquipItem';

export const MedalItem = () => {
  const medalId = useStore($currentMedalId);

  function handleEdit() {
    openMedalSelection();
  }

  function handleDelete() {
    setCharacterMedal(null);
  }

  return (
    <SimpleEquipItem
      id={medalId()}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};
