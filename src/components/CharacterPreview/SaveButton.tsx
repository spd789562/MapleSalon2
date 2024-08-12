import { createSignal } from 'solid-js';

import { Box } from 'styled-system/jsx/box';
import { saveCurrentCharacter } from '@/store/characterDrawer';
import { applyCharacterChanges } from '@/store/character/action';

import UserRoundPlusIcon from 'lucide-solid/icons/user-round-plus';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';

import { toaster } from '../GlobalToast';

export const SaveButton = () => {
  const [isLoading, setIsLoading] = createSignal(false);

  async function handleSave() {
    setIsLoading(true);
    await saveCurrentCharacter();
    applyCharacterChanges();
    setIsLoading(false);
    toaster.success({
      title: '儲存成功',
      description: '角色已儲存',
    });
  }

  async function handleSaveNewCharacter() {
    setIsLoading(true);
    await saveCurrentCharacter(true);
    applyCharacterChanges();
    setIsLoading(false);
    toaster.success({
      title: '儲存成功',
      description: '以另存為新角色',
    });
  }

  return (
    <Box>
      <Button
        w="24"
        onClick={handleSave}
        disabled={isLoading()}
        borderRightRadius="0"
      >
        儲存
      </Button>
      <IconButton
        variant="outline"
        onClick={handleSaveNewCharacter}
        disabled={isLoading()}
        title="另存為新角色"
        borderLeftRadius="0"
      >
        <UserRoundPlusIcon />
      </IconButton>
    </Box>
  );
};
