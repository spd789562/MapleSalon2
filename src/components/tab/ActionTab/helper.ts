import { ActionExportType, ActionExportTypeMimeType } from '@/const/toolTab';

import type { Character } from '@/renderer/character/character';
import type { CanvasFramesData } from '@/renderer/character/characterToCanvasFrames';

import { characterFramesToGif } from '@/utils/exportImage/framesToGif';
import { characterFramesToApng } from '@/utils/exportImage/framesToApng';
import { characterFramesToWebp } from '@/utils/exportImage/framesToWebp';

/** return name-action or action */
export function getCharacterFilenameSuffix(character: Character) {
  const nameSuffix = character.name && `${character.name}-`;
  return `${nameSuffix}${character.instruction || character.action}`;
}

export async function getCharacterFrameBlobs(
  data: CanvasFramesData,
  character: Character,
  options?: { includeMoveJson?: boolean },
) {
  const files: [Blob, string][] = [];
  const fileNameSuffix = getCharacterFilenameSuffix(character);
  console.log('data.frames', fileNameSuffix, data.frames);
  for await (const [index, frame] of data.frames.entries()) {
    const blob = await new Promise<Blob>((resolve) => {
      frame.canvas.toBlob((blob) => {
        blob && resolve(blob);
      });
    });
    files.push([blob, `${fileNameSuffix}-${index}.png`]);
  }
  if (options?.includeMoveJson) {
    const moveJson = data.frames.map((frame) => ({
      x: frame.left,
      y: frame.top,
      delay: frame.delay,
    }));
    const blob = new Blob([JSON.stringify(moveJson)], {
      type: 'application/json',
    });
    files.push([blob, `${fileNameSuffix}.json`]);
  }
  return files;
}

export async function getAnimatedCharacterBlob(
  data: CanvasFramesData,
  type: ActionExportType,
) {
  let blob: Blob | undefined;

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
