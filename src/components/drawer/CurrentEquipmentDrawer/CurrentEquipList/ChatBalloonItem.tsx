import { useStore } from '@nanostores/solid';

import { openChatBalloonSelection } from '@/store/currentEquipDrawer';
import { $currentChatBalloonId } from '@/store/character/selector';
import { setCharacterChatBalloon } from '@/store/character/action';
import { SimpleEquipItem } from './SimpleEquipItem';

export const ChatBalloonItem = () => {
  const nameTagId = useStore($currentChatBalloonId);

  function handleEdit() {
    openChatBalloonSelection();
  }

  function handleDelete() {
    setCharacterChatBalloon(undefined);
  }

  return (
    <SimpleEquipItem
      id={nameTagId()}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};
