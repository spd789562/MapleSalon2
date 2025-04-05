import { createSignal, Show } from 'solid-js';

import { useActionTab } from './ActionTabContext';
import { useTranslate } from '@/context/i18n';

import { $forceExportEffect } from '@/store/toolTab';
import { $globalRenderer } from '@/store/renderer';

import PluginLineIcon from 'mingcute_icon/svg/device/plugin_2_line.svg';
import { Button, type ButtonProps } from '@/components/ui/button';
import type { ActionCharacterRef } from './ActionCharacter';
import { SpinLoading } from '@/components/elements/SpinLoading';
import { toaster } from '@/components/GlobalToast';
import { getCharacterPartsBlobs, getCharacterFacesBlobs } from './helper';
import { batchExportCharacterPart } from './batchExportCharacterFrames';
import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

export interface ExportPartsButtonProps {
  characterRefs: ActionCharacterRef[];
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  isIcon?: boolean;
}
export const ExportPartsButton = (props: ExportPartsButtonProps) => {
  const t = useTranslate();
  const [state, { startExport, finishExport }] = useActionTab();
  const [isExporting, setIsExporting] = createSignal(false);

  function tooManyImageWarning() {
    if (!$forceExportEffect.get()) {
      return;
    }
    toaster.create({
      title: t('export.exporting'),
      description: t('export.effectExportDesc'),
    });
  }

  async function handleClick() {
    if (isExporting() || state.isExporting) {
      return;
    }
    const isAllLoaded =
      props.characterRefs.every(
        (characterRef) => !characterRef.character.isLoading,
      ) && props.characterRefs.length !== 0;
    if (!isAllLoaded) {
      toaster.error({
        title: t('export.actionNotLoaded'),
      });
      return;
    }
    startExport();
    setIsExporting(true);
    await nextTick();

    if (props.characterRefs.length > 1) {
      tooManyImageWarning();
    }

    try {
      const files: [Blob, string][] = [];
      const app = $globalRenderer.get();
      await props.characterRefs[0].character.loadFaceAssets();
      const faces = await getCharacterFacesBlobs(
        props.characterRefs[0].character,
        app.renderer,
      );
      files.push(...faces);

      if (props.characterRefs.length === 1) {
        const characterRef = props.characterRefs[0];
        const frameData = await characterRef.makeCharacterFrames({
          padWhiteSpace: true,
          exportParts: true,
        });
        const fileBlobs = await getCharacterPartsBlobs(
          frameData,
          characterRef.character,
        );
        files.push(...fileBlobs);
      } else {
        const exportCharacterData = await batchExportCharacterPart(
          props.characterRefs.map((ref) => ref.character),
          app.renderer,
          {
            simple: !$forceExportEffect.get(),
          },
        );
        // this process is heavy, don't do it concurrently
        for await (const [character, data] of exportCharacterData) {
          const blob = await getCharacterPartsBlobs(data, character);
          files.push(...blob);
        }
      }
      if (files.length === 1) {
        const file = files[0];
        downloadBlob(file[0], file[1]);
      } else {
        const zipBlob = await makeBlobsZipBlob(files);
        const fileName = 'character-layered-frame.zip';
        downloadBlob(zipBlob, fileName);
      }
      toaster.success({
        title: t('export.success'),
      });
    } catch (_) {
      toaster.error({
        title: t('export.error'),
      });
    } finally {
      setIsExporting(false);
      finishExport();
    }
  }

  return (
    <Button
      size={props.size}
      variant={props.variant}
      title={t('export.partsDesc')}
      onClick={handleClick}
      disabled={isExporting() || state.isExporting}
    >
      <Show when={props.isIcon} fallback={t('export.parts')}>
        <PluginLineIcon width="20" height="20" />
      </Show>
      <Show when={isExporting()}>
        <SpinLoading size={16} />
      </Show>
    </Button>
  );
};
