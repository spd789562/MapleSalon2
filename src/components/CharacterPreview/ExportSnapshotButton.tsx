import { useTranslate } from '@/context/i18n';

import { $globalRenderer } from '@/store/renderer';

import { useCharacterPreview } from './CharacterPreviewContext';

import { Button } from '@/components/ui/button';
import { exportCharacterSnapshot } from './ExportAnimationButton';

import { toaster } from '@/components/GlobalToast';

export const ExportSnapshotButton = () => {
  const t = useTranslate();
  const [state] = useCharacterPreview();

  function handleClick() {
    if (state.isExporting) {
      return;
    }

    const app = $globalRenderer.get();
    if (!(app && state.characterRef)) {
      toaster.error({
        title: t('export.notLoaded'),
      });
      return;
    }
    exportCharacterSnapshot(t, state.characterRef);
  }

  return (
    <Button
      variant="outline"
      title={t('export.currentSnapshot')}
      onClick={handleClick}
      disabled={state.isExporting}
    >
      {t('export.snapshot')}
    </Button>
  );
};
