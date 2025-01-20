import { createSignal, Show } from 'solid-js';

import { computed } from 'nanostores';
import { $actionExportType, $forceExportEffect } from '@/store/toolTab';
import {
  $addBlackBgWhenExportGif,
  $gifBackgroundColor,
} from '@/store/settingDialog';
import { $globalRenderer } from '@/store/renderer';

import { useActionTab } from './ActionTabContext';
import { useTranslate } from '@/context/i18n';

import ImagePlay from 'lucide-solid/icons/image-play';
import { Button, type ButtonProps } from '@/components/ui/button';
import type { ActionCharacterRef } from './ActionCharacter';
import { SpinLoading } from '@/components/elements/SpinLoading';

import { ActionExportTypeExtensions } from '@/const/toolTab';

import { toaster } from '@/components/GlobalToast';
import { batchExportCharacterFrames } from './batchExportCharacterFrames';
import { getAnimatedCharacterBlob, getCharacterFilenameSuffix } from './helper';
import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

export const $exportBackgroundColor = computed(
  [$actionExportType, $addBlackBgWhenExportGif, $gifBackgroundColor],
  (exportType, addBlackBgWhenExportGif, gifBackgroundColor) => {
    if (exportType === 'gif' && addBlackBgWhenExportGif) {
      return gifBackgroundColor;
    }
    return undefined;
  },
);

export interface ExportAnimateButtonProps {
  characterRefs: ActionCharacterRef[];
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  isIcon?: boolean;
}
export const ExportAnimateButton = (props: ExportAnimateButtonProps) => {
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
      ) && props.characterRefs.length >= 0;
    if (!isAllLoaded) {
      toaster.error({
        title: t('export.actionNotLoaded'),
      });
      return;
    }
    startExport();
    setIsExporting(true);
    await nextTick();
    const exportType = $actionExportType.get();
    const exportExt = ActionExportTypeExtensions[exportType];

    if (props.characterRefs.length > 5) {
      tooManyImageWarning();
    }

    try {
      const files: [Blob, string][] = [];
      const backgroundColor = $exportBackgroundColor.get();
      if (props.characterRefs.length === 1) {
        const characterRef = props.characterRefs[0];
        const frameData = await characterRef.makeCharacterFrames({
          padWhiteSpace: true,
          backgroundColor,
        });
        const blob = await getAnimatedCharacterBlob(frameData, exportType);
        const fileNameSuffix = getCharacterFilenameSuffix(
          characterRef.character,
        );
        downloadBlob(blob, `${fileNameSuffix}${exportExt}`);
      } else {
        const exportCharacterData = await batchExportCharacterFrames(
          props.characterRefs.map((ref) => ref.character),
          $globalRenderer.get().renderer,
          {
            padWhiteSpace: true,
            backgroundColor,
            simple: !$forceExportEffect.get(),
          },
        );
        await Promise.all(
          exportCharacterData.map(async ([character, data]) => {
            const blob = await getAnimatedCharacterBlob(data, exportType);
            const fileNameSuffix = getCharacterFilenameSuffix(character);
            files.push([blob, `${fileNameSuffix}${exportExt}`]);
          }),
        );
        const zipBlob = await makeBlobsZipBlob(files);
        const fileName = 'character-action.zip';
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
      onClick={handleClick}
      disabled={isExporting() || state.isExporting}
      title={t('export.animation')}
    >
      <Show when={props.isIcon} fallback={t('export.animation')}>
        <ImagePlay />
      </Show>
      <Show when={isExporting()}>
        <SpinLoading size={16} />
      </Show>
    </Button>
  );
};
