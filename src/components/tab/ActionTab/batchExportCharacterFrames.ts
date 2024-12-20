import { type Renderer, Ticker, Bounds } from 'pixi.js';
import type { Character } from '@/renderer/character/character';

import type {
  UniversalFrame,
  CanvasFramesData,
} from '@/renderer/makeCanvasFrame';
import { getCharacterFilenameSuffix } from './helper';
import { generateCharacterTimeline } from '@/renderer/character/characterToCanvasFrames';
import { extractCanvas } from '@/utils/extract';
import { createMergedTimeline } from '@/utils/timline';
import { nextTick } from '@/utils/eventLoop';

interface CharacterExportData {
  character: Character;
  timeline: number[];
  data: UniversalFrame[];
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
  },
) {
  Ticker.shared.stop();
  const current = performance.now();
  Ticker.shared.update(current);

  const characterSet = createCharacterDataSet(characters);
  const useCharactersData = Array.from(characterSet.values());
  await nextTick();
  const totalTimeline = createMergedTimeline(
    Array.from(characterSet.values()).map((v) => v.timeline),
  );
  console.log('final timeline', totalTimeline);

  let add = 0;
  const totalFrameCount = totalTimeline.length;
  for (let i = 0; i < totalFrameCount; i++) {
    const frame = totalTimeline[i];
    for (const character of useCharactersData) {
      if (
        frame <= character.maxFrame &&
        // some frame might still be miss when add 16.666
        character.timeline[character.nextFrameIndex] >= frame
      ) {
        extractAndPutToData(character, renderer);
      }
    }
    // keep tick until next frame
    if (i < totalFrameCount - 1) {
      while (add < totalTimeline[i + 1]) {
        add += 10.0;
        Ticker.shared.update(current + add);
        await nextTick();
      }
    }
  }
  const exportCharacterData: [Character, CanvasFramesData][] = [];

  for (const [_, data] of characterSet) {
    exportCharacterData.push([data.character, makeCanvasFrame(data, options)]);
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
    console.log(timelines, singleTimeline);
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
    left: frameBound.left,
    top: frameBound.top,
  };
  data.bound.addBounds(frameBound);

  data.data.push(frameData);
  data.nextFrameIndex += 1;
}

function makeCanvasFrame(
  data: CharacterExportData,
  options?: { padWhiteSpace?: boolean; backgroundColor?: string },
) {
  const { minX, minY, width, height } = data.bound;
  const exportFrames = data.data.map((frame) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const needPad =
      options?.padWhiteSpace || options?.padWhiteSpace === undefined;
    const top = needPad ? -minY + frame.top : -frame.top;
    const left = needPad ? -minX + frame.left : -frame.left;

    if (needPad) {
      canvas.width = width;
      canvas.height = height;
    } else {
      canvas.width = frame.width;
      canvas.height = frame.height;
    }

    if (options?.backgroundColor) {
      ctx.fillStyle = options?.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (needPad) {
      ctx.drawImage(frame.canvas, left, top);
    } else {
      ctx.drawImage(frame.canvas, 0, 0);
    }

    frame.canvas.remove();

    return {
      canvas,
      top,
      left,
      delay: frame.delay,
      width: canvas.width,
      height: canvas.height,
    };
  });

  return {
    frames: exportFrames,
    width,
    height,
  };
}
