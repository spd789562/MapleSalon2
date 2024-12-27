import { useTranslate } from '@/context/i18n';

import { $globalRenderer } from '@/store/renderer';

import { useChairTab } from './ChairTabContext';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { extractCanvas } from '@/utils/extract';
import { copyCanvas } from '@/utils/clipboard';

export const ExportSnapshotToClipboardButton = () => {
  const t = useTranslate();

  const [state] = useChairTab();

  async function handleClick() {
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
    const frame = extractCanvas(
      state.chairRef,
      app.renderer,
    ) as HTMLCanvasElement;
    try {
      await copyCanvas(frame);
      toaster.success({
        title: t('export.copySuccess'),
      });
    } catch (_) {
      toaster.error({
        title: t('export.copyError'),
      });
    }
  }

  return (
    <Button
      variant="outline"
      title={t('export.copyCurrentSnapshot')}
      onClick={handleClick}
      disabled={state.isExporting}
    >
      {t('export.copySnapshot')}
    </Button>
  );
};
