import { useTranslate } from '@/context/i18n';

import { resetCharacterChanges } from '@/store/character/action';
import { openDialog, DialogType } from '@/store/confirmDialog';

import { Button } from '@/components/ui/button';

export const ResetButton = () => {
  const t = useTranslate();
  function handleReset() {
    openDialog({
      type: DialogType.Confirm,
      title: t('setting.cancelChanges'),
      description: t('setting.cancelChangesDesc'),
      confirmButton: {
        onClick: () => resetCharacterChanges(),
      },
    });
  }

  return (
    <Button
      variant="outline"
      title={t('setting.cancelCharacterChanges')}
      onClick={handleReset}
    >
      {t('setting.cancelChanges')}
    </Button>
  );
};
