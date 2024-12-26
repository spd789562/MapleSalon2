import { $globalRenderer } from '@/store/renderer';

import { useChairTab } from './ChairTabContext';
import { useTranslate } from '@/context/i18n';

import { Button } from '@/components/ui/button';
import { extractCanvas } from '@/utils/extract';
import { downloadCanvas } from '@/utils/download';

import { toaster } from '@/components/GlobalToast';

export const ExportSnapshotButton = () => {
  const t = useTranslate();
  const [state] = useChairTab();

  function handleClick() {
    if (state.isExporting) {
      return;
    }

    const app = $globalRenderer.get();
    if (!(app && state.chairRef)) {
      toaster.error({
        title: t('export.notLoaded'),
      });
      return;
    }
    try {
      const data = extractCanvas(
        state.chairRef,
        app.renderer,
      ) as HTMLCanvasElement;
      downloadCanvas(data, `chair-${state.chairRef.id}.png`);
    } catch (_) {
      toaster.error({
        title: t('export.error'),
      });
    }
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
