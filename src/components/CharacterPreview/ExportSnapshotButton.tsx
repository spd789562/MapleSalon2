import { $globalRenderer } from '@/store/renderer';

import { useCharacterPreview } from './CharacterPreviewContext';

import { Button } from '@/components/ui/button';
import { exportCharacterSnapshot } from './ExportAnimationButton';

import { toaster } from '@/components/GlobalToast';

export const ExportSnapshotButton = () => {
  const [state] = useCharacterPreview();

  function handleClick() {
    if (state.isExporting) {
      return;
    }

    const app = $globalRenderer.get();
    if (!(app && state.characterRef)) {
      toaster.error({
        title: '尚未載入完畢',
      });
      return;
    }
    exportCharacterSnapshot(state.characterRef);
  }

  return (
    <Button
      variant="outline"
      title="匯出當前快照"
      onClick={handleClick}
      disabled={state.isExporting}
    >
      匯出快照
    </Button>
  );
};
