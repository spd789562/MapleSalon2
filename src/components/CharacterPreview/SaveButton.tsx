import { createSignal } from 'solid-js';
import { useTranslate } from '@/context/i18n';

import { Box } from 'styled-system/jsx/box';
import { saveCurrentCharacter } from '@/store/characterDrawer';
import { applyCharacterChanges } from '@/store/character/action';

import UserRoundPlusIcon from 'lucide-solid/icons/user-round-plus';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';

import { toaster } from '../GlobalToast';

export const SaveButton = () => {
  const t = useTranslate();
  const [isLoading, setIsLoading] = createSignal(false);

  async function handleSave() {
    setIsLoading(true);
    await saveCurrentCharacter();
    applyCharacterChanges();
    setIsLoading(false);
    toaster.success({
      title: t('setting.saveSuccess'),
      description: t('setting.saveCharacterSuccess'),
    });
  }

  async function handleSaveNewCharacter() {
    setIsLoading(true);
    await saveCurrentCharacter(true);
    applyCharacterChanges();
    setIsLoading(false);
    toaster.success({
      title: t('setting.saveSuccess'),
      description: t('setting.saveAsNewCharacterSuccess'),
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
        {t('setting.save')}
      </Button>
      <IconButton
        variant="outline"
        onClick={handleSaveNewCharacter}
        disabled={isLoading()}
        title={t('setting.saveAsNew')}
        borderLeftRadius="0"
      >
        <UserRoundPlusIcon />
      </IconButton>
    </Box>
  );
};
