import { type Renderer, Ticker, Bounds } from 'pixi.js';
import type { Character } from '@/renderer/character/character';

import type {
  UniversalFrame,
  CanvasFramesData,
} from '@/renderer/makeCanvasFrame';
import { toPaddedFrames } from '@/renderer/makeCanvasFrame';
import { getCharacterFilenameSuffix } from './helper';
import {
  generateCharacterTimeline,
  generatePartsFrame,
} from '@/renderer/character/characterToCanvasFrames';
import { extractCanvas } from '@/utils/extract';
import { createMergedTimeline } from '@/utils/timline';
import { nextTick } from '@/utils/eventLoop';

interface CharacterExportData {
  character: Character;
  timeline: number[];
  data: UniversalFrame[] | UniversalFrame[][];
  bound: Bounds;
  nextFrameIndex: number;
  maxFrame: number;
}

export async function batchExportCharacterFrames(
  characters: Character[],
  renderer: Renderer,
  options?: {
    backgroundColor?: string;
    padWhiteSpace?: boolean;
    simple?: boolean;
  },
) {
  Ticker.shared.stop();
  const current = performance.now();
  Ticker.shared.update(current);

  const characterSet = options?.simple
    ? createSimpleCharacterDataSet(characters)
    : createCharacterDataSet(characters);
  const useCharactersData = Array.from(characterSet.values());
  await nextTick();
  const totalTimeline = createMergedTimeline(
    Array.from(characterSet.values()).map((v) => v.timeline),
  );

  let add = 0;
  const totalFrameCount = totalTimeline.length;
  for (let i = 0; i < totalFrameCount; i++) {
    const frame = totalTimeline[i];
    for (const character of useCharactersData) {
      if (
        frame <= character.maxFrame &&
        // some frame might still be miss
        frame >= character.timeline[character.nextFrameIndex]
      ) {
        extractAndPutToData(character, renderer);
        await nextTick();
      }
    }
    // keep tick until next frame
    if (i < totalFrameCount - 1) {
      while (add < totalTimeline[i + 1]) {
        add += 10.0;
        Ticker.shared.update(current + add);
      }
    }
    await nextTick();
  }
  const exportCharacterData: [Character, CanvasFramesData][] = [];

  for (const [_, data] of characterSet) {
    exportCharacterData.push([
      data.character,
      options?.padWhiteSpace
        ? toPaddedFrames(data.data as UniversalFrame[], data.bound, options)
        : {
            frames: data.data,
            width: data.bound.width,
            height: data.bound.height,
          },
    ]);
  }

  Ticker.shared.start();

  return exportCharacterData;
}

export async function batchExportCharacterPart(
  characters: Character[],
  renderer: Renderer,
  options?: {
    simple?: boolean;
  },
) {
  Ticker.shared.stop();
  const current = performance.now();
  Ticker.shared.update(current);

  const characterSet = options?.simple
    ? createSimpleCharacterDataSet(characters)
    : createCharacterDataSet(characters);
  const useCharactersData = Array.from(characterSet.values());
  await nextTick();
  const totalTimeline = createMergedTimeline(
    Array.from(characterSet.values()).map((v) => v.timeline),
  );

  let add = 0;
  const totalFrameCount = totalTimeline.length;
  for (let i = 0; i < totalFrameCount; i++) {
    const frame = totalTimeline[i];
    for (const character of useCharactersData) {
      if (
        frame <= character.maxFrame &&
        // some frame might still be miss
        frame >= character.timeline[character.nextFrameIndex]
      ) {
        extractPartsAndPutToData(character, renderer);
      }
    }
    // keep tick until next frame
    if (i < totalFrameCount - 1) {
      while (add < totalTimeline[i + 1]) {
        add += 10.0;
        Ticker.shared.update(current + add);
      }
    }
    await nextTick();
  }
  const exportCharacterData: [Character, CanvasFramesData][] = [];

  for (const [_, data] of characterSet) {
    const maxWidth = data.bound.right - data.bound.left;
    const maxHeight = data.bound.bottom - data.bound.top;

    const exportFrames = (data.data as UniversalFrame[][]).map(
      (frames) => toPaddedFrames(frames, data.bound).frames,
    );

    exportCharacterData.push([
      data.character,
      {
        frames: exportFrames,
        width: maxWidth,
        height: maxHeight,
      },
    ]);
  }

  Ticker.shared.start();

  return exportCharacterData;
}

function createCharacterDataSet(characters: Character[]) {
  const characterSet = new Map<string, CharacterExportData>();

  for (const character of characters) {
    /* reset character frame */
    character.instructionFrame = 0;
    character.currentDelta = 0;
    character.playBodyFrame();

    const suffix = getCharacterFilenameSuffix(character);
    const { timelines } = generateCharacterTimeline(character);
    const singleTimeline = createMergedTimeline(timelines);
    characterSet.set(suffix, {
      character,
      timeline: singleTimeline,
      data: [],
      bound: new Bounds(),
      nextFrameIndex: 0,
      maxFrame: singleTimeline[singleTimeline.length - 1],
    });
  }
  return characterSet;
}

function createSimpleCharacterDataSet(characters: Character[]) {
  const characterSet = new Map<string, CharacterExportData>();

  for (const character of characters) {
    /* reset character frame */
    character.instructionFrame = 0;
    character.currentDelta = 0;
    character.playBodyFrame();

    const suffix = getCharacterFilenameSuffix(character);
    const timeline = character.currentInstructions.reduce((acc, frame) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(prev + (frame.delay ?? 100) * character.speed);
      return acc;
    }, [] as number[]);
    if (!character.isHideAllEffect) {
      for (const effect of character.allEffectPieces) {
        effect.currentFrame = 0;
        /* @ts-ignore */
        effect._currentTime = 0;
      }
    }
    characterSet.set(suffix, {
      character,
      timeline,
      data: [],
      bound: new Bounds(),
      nextFrameIndex: 0,
      maxFrame: timeline[timeline.length - 1],
    });
  }
  return characterSet;
}

function extractAndPutToData(data: CharacterExportData, renderer: Renderer) {
  const canvas = extractCanvas(data.character, renderer) as HTMLCanvasElement;
  const frameBound = data.character.getLocalBounds();
  const delay =
    data.nextFrameIndex === 0
      ? data.timeline[0]
      : data.timeline[data.nextFrameIndex] -
        data.timeline[data.nextFrameIndex - 1];
  const frameData: UniversalFrame = {
    canvas,
    delay,
    width: canvas.width,
    height: canvas.height,
    left: -frameBound.left,
    top: -frameBound.top,
  };
  data.bound.addBounds(frameBound);

  (data.data as UniversalFrame[]).push(frameData);
  data.nextFrameIndex += 1;
}
function extractPartsAndPutToData(
  data: CharacterExportData,
  renderer: Renderer,
) {
  const frameBound = data.character.getLocalBounds();
  const delay =
    data.nextFrameIndex === 0
      ? data.timeline[0]
      : data.timeline[data.nextFrameIndex] -
        data.timeline[data.nextFrameIndex - 1];
  data.bound.addBounds(frameBound);

  (data.data as UniversalFrame[][]).push(
    generatePartsFrame(data.character, renderer, { delay }),
  );
  data.nextFrameIndex += 1;
}
