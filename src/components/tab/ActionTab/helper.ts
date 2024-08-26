import { ActionExportType, ActionExportTypeMimeType } from '@/const/toolTab';

import type { Character } from '@/renderer/character/character';
import type { CanvasFramesData } from '@/renderer/character/characterToCanvasFrames';

import { characterFramesToGif } from '@/utils/exportImage/framesToGif';
import { characterFramesToApng } from '@/utils/exportImage/framesToApng';
import { characterFramesToWebp } from '@/utils/exportImage/framesToWebp';

/** return name-action or action */
export function getCharacterFilenameSuffix(character: Character) {
  const nameSuffix = character.name && `${character.name}-`;
  return `${nameSuffix}${character.action}`;
}

export async function getCharacterFrameBlobs(
  data: CanvasFramesData,
  character: Character,
) {
  const files: [Blob, string][] = [];
  const fileNameSuffix = getCharacterFilenameSuffix(character);
  for await (const [index, frame] of data.frames.entries()) {
    const blob = await new Promise<Blob>((resolve) => {
      frame.canvas.toBlob((blob) => {
        blob && resolve(blob);
      });
    });
    files.push([blob, `${fileNameSuffix}-${index}.png`]);
  }
  return files;
}

export async function getAnimatedCharacterBlob(
  data: CanvasFramesData,
  type: ActionExportType,
) {
  let blob: Blob | undefined = undefined;

  if (type === ActionExportType.Gif) {
    const buffer = await characterFramesToGif(data.frames, {
      width: data.width,
      height: data.height,
    });
    blob = new Blob([buffer], { type: ActionExportTypeMimeType[type] });
  } else if (type === ActionExportType.Apng) {
    const buffer = await characterFramesToApng(data.frames, {
      width: data.width,
      height: data.height,
    });
    blob = new Blob([buffer], { type: ActionExportTypeMimeType[type] });
  } else if (type === ActionExportType.Webp) {
    const buffer = await characterFramesToWebp(data.frames, {
      width: data.width,
      height: data.height,
    });
    if (buffer) {
      blob = new Blob([buffer], { type: ActionExportTypeMimeType[type] });
    }
  }

  if (!blob) {
    throw new Error('Unsupported export type');
  }

  return blob;
}
