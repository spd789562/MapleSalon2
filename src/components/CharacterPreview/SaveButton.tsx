import { createSignal } from 'solid-js';

import { saveCurrentCharacter } from '@/store/characterDrawer';
import { applyCharacterChanges } from '@/store/character/action';

import { Button } from '@/components/ui/button';

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

  return (
    <Button w="24" onClick={handleSave} disabled={isLoading()}>
      儲存
    </Button>
  );
};
