import type { Texture } from 'pixi.js';

import { $padWhiteSpaceWhenExportFrame } from '@/store/settingDialog';
import { $globalRenderer } from '@/store/renderer';

import { useSkillTab } from './SkillTabContext';
import { useTranslate } from '@/context/i18n';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getCharacterFrameBlobs } from '@/components/tab/ActionTab/helper';
import { characterToCanvasFramesWithEffects } from '@/renderer/character/characterToCanvasFrames';
import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

export const ExportFrameButton = () => {
  const t = useTranslate();
  const [state, { startExport, finishExport, updateExportProgress }] =
    useSkillTab();

  async function handleClick() {
    if (state.isExporting) {
      return;
    }

    const app = $globalRenderer.get();
    if (!(app && state.skillRef && state.characterRef)) {
      toaster.error({
        title: t('export.notLoaded'),
      });
      return;
    }
    startExport();
    state.skillRef.visible = false;

    await nextTick();
    const padWhiteSpace = $padWhiteSpaceWhenExportFrame.get();
    const skillTextures = state.skillRef.currentItems
      .flatMap((item) => item.frames)
      .map(
        (frame) =>
          [
            /* something like effect/0/ or screen/ */
            `${frame.skillItem.name}/${frame.skillItem.subName}${frame.skillItem.subName && '/'}${frame.frame}.png`,
            frame.getTexture() as Texture,
          ] as [string, Texture],
      );
    const skillOriginJsons = state.skillRef.currentItems.map((item) => {
      const originJson = item.frames.reduce(
        (acc, frame) => {
          acc[frame.frame] = {
            x: frame.frameData?.origin?.x || 0,
            y: frame.frameData?.origin?.y || 0,
            delay: frame.delay,
          };
          return acc;
        },
        {} as Record<string, unknown>,
      );
      const blob = new Blob([JSON.stringify(originJson)], {
        type: 'application/json',
      });
      return [
        blob,
        `${item.name}/${item.subName}${item.subName && '/'}origin.json`,
      ] as [Blob, string];
    });

    try {
      const files: [Blob, string][] = [];
      const skillTexture = await Promise.all(
        skillTextures.map(
          ([name, texture]) =>
            new Promise<[Blob, string]>((resolve) => {
              (
                app.renderer.texture.generateCanvas(
                  texture,
                ) as HTMLCanvasElement
              ).toBlob((blob) => {
                blob && resolve([blob, name]);
              });
            }),
        ),
      );

      files.push(...skillTexture);
      files.push(...skillOriginJsons);

      const frameData = await characterToCanvasFramesWithEffects(
        state.characterRef,
        app.renderer,
        {
          onProgress: updateExportProgress,
          padWhiteSpace,
        },
      );
      files.push(
        ...(await getCharacterFrameBlobs(frameData, state.characterRef, {
          includeMoveJson: true,
        })),
      );
      const zipBlob = await makeBlobsZipBlob(files);
      const fileName = `skill-${state.skillRef.id}-frame.zip`;
      downloadBlob(zipBlob, fileName);
      toaster.success({
        title: t('export.success'),
      });
    } catch (_) {
      toaster.error({
        title: t('export.error'),
      });
    } finally {
      state.skillRef.visible = true;
      finishExport();
    }
  }

  return (
    <Button
      variant="outline"
      title={t('export.skillAssets')}
      onClick={handleClick}
      disabled={state.isExporting}
    >
      {t('export.assets')}
    </Button>
  );
};
