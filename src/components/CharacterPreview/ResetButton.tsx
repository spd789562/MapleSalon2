import { resetCharacterChanges } from '@/store/character/action';

import { openDialog, DialogType } from '@/store/confirmDialog';

import { Button } from '@/components/ui/button';

export const ResetButton = () => {
  function handleReset() {
    openDialog({
      type: DialogType.Confirm,
      title: '取消變更',
      description: '此操作無法返回，確定要取消變更？',
      confirmButton: {
        onClick: () => resetCharacterChanges(),
      },
    });
  }

  return (
    <Button
      variant="outline"
      title="取消任何角色變更至為儲存的樣子"
      onClick={handleReset}
    >
      取消變更
    </Button>
  );
};
