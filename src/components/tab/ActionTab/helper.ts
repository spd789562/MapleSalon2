import type { Renderer } from 'pixi.js';
import { ActionExportType, ActionExportTypeMimeType } from '@/const/toolTab';

import type { Character } from '@/renderer/character/character';
import type {
  CanvasFramesData,
  UniversalFrame,
} from '@/renderer/character/characterToCanvasFrames';

import { characterFramesToGif } from '@/utils/exportImage/framesToGif';
import { characterFramesToApng } from '@/utils/exportImage/framesToApng';
import { characterFramesToWebp } from '@/utils/exportImage/framesToWebp';
import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';
import { extractCanvas, getBlobFromCanvas } from '@/utils/extract';

/** return name-action or action */
export function getCharacterFilenamePrefix(character: Character) {
  const namePrefix = character.name && `${character.name}-`;
  return `${namePrefix}${character.instruction || character.action}`;
}

export async function getCharacterFrameBlobs(
  data: CanvasFramesData,
  character: Character,
  options?: { includeMoveJson?: boolean; prefix?: string },
) {
  if (Array.isArray(data.frames[0])) {
    return [];
  }
  const frames = data.frames as UniversalFrame[];
  const files: [Blob, string][] = [];
  const fileNamePrefix =
    options?.prefix ?? getCharacterFilenamePrefix(character);
  for await (const [index, frame] of frames.entries()) {
    const blob = await new Promise<Blob>((resolve) => {
      frame.canvas.toBlob((blob) => {
        blob && resolve(blob);
      });
    });
    files.push([blob, `${fileNamePrefix}-${index}.png`]);
  }
  if (options?.includeMoveJson) {
    const moveJson = frames.map((frame) => ({
      x: frame.left,
      y: frame.top,
      delay: frame.delay,
    }));
    const blob = new Blob([JSON.stringify(moveJson)], {
      type: 'application/json',
    });
    files.push([blob, `${fileNamePrefix}.json`]);
  }
  return files;
}

export async function getAnimatedCharacterBlob(
  data: CanvasFramesData,
  type: ActionExportType,
) {
  if (Array.isArray(data.frames[0])) {
    throw new Error('wrong canvas data');
  }
  const frames = data.frames as UniversalFrame[];
  let blob: Blob | undefined;

  if (type === ActionExportType.Gif) {
    const buffer = await characterFramesToGif(frames, {
      width: data.width,
      height: data.height,
    });
    blob = new Blob([buffer], { type: ActionExportTypeMimeType[type] });
  } else if (type === ActionExportType.Apng) {
    const buffer = await characterFramesToApng(frames, {
      width: data.width,
      height: data.height,
    });
    blob = new Blob([buffer], { type: ActionExportTypeMimeType[type] });
  } else if (type === ActionExportType.Webp) {
    const buffer = await characterFramesToWebp(frames, {
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

export async function getCharacterPartsBlobs(
  data: CanvasFramesData,
  character: Character,
) {
  if (!Array.isArray(data.frames[0])) {
    return [];
  }
  const actions = data.frames as UniversalFrame[][];
  const files: [Blob, string][] = [];
  const fileNamePrefix = getCharacterFilenamePrefix(character);
  const addBlobs: Promise<void>[] = [];
  for (const [frameIndex, frames] of actions.entries()) {
    const name = `${fileNamePrefix}_${frameIndex}.zip`;
    addBlobs.push(
      createActionPartZipBlob(frames).then((blob) => {
        files.push([blob, name]);
      }),
    );
  }
  await Promise.all(addBlobs);
  return files;
}

export async function getCharacterFacesBlobs(
  character: Character,
  renderer: Renderer,
) {
  const faceItems = character.faceItems;
  const mainFaceItem =
    faceItems.length > 0
      ? faceItems[0]
      : faceItems.find((item) => item.isOverrideFace) || faceItems[0];
  const faceBlobs: [Blob, string][] = [];
  if (mainFaceItem) {
    const facePair: [Promise<Blob>, string][] = [];
    for (const [key, piece] of Array.from(
      mainFaceItem.actionPieces.entries(),
    )) {
      facePair.push(
        ...piece.allPieces.map((p) => {
          const fileName = `faces/${key}_${p.frame}.png`;
          const canvas = extractCanvas(
            p.frameData.getRenderAble(),
            renderer,
          ) as HTMLCanvasElement;
          return [getBlobFromCanvas(canvas), fileName] as [
            Promise<Blob>,
            string,
          ];
        }),
      );
    }
    const faceBlob = (await Promise.all(
      facePair.map(([blob, name]) => blob.then((b) => [b, name])),
    )) as [Blob, string][];
    faceBlobs.push(...faceBlob);
  }
  return faceBlobs;
}

async function createActionPartZipBlob(
  frames: UniversalFrame[],
): Promise<Blob> {
  const files: [Blob, string][] = [];
  const addBlobs: Promise<void>[] = [];
  for (const [layerIndex, frame] of frames.entries()) {
    addBlobs.push(
      new Promise<Blob>((resolve) => {
        frame.canvas.toBlob((blob) => {
          blob && resolve(blob);
        });
      }).then((blob) => {
        files.push([
          blob,
          `L${layerIndex + 1},R1,C1,${frame.name ?? 'unknown'},visible,normal,255.png`,
        ]);
        frame.canvas.width = 0;
        frame.canvas.height = 0;
        frame.canvas.remove();
      }),
    );
  }
  files.push([
    new Blob(['PDN3'], {
      type: 'text/plain',
    }),
    'PaintDotNet.txt',
  ]);
  await Promise.all(addBlobs);
  const blob = await makeBlobsZipBlob(files);
  return blob;
}
