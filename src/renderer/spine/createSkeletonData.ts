import { Assets } from 'pixi.js';
import {
  type SkeletonData,
  AtlasAttachmentLoader,
  SkeletonJson,
  SkeletonBinary,
} from '@esotericsoftware/spine-pixi-v8';

import type { WzSpineData } from './const/wz';
import { type SpineInfo, SpineType, SpineVersion } from './const/type';
import { CharacterLoader } from '../character/loader';
import {
  getSpineInfo,
  getMainVersionFromJson,
  getMainVersionFromBinary,
} from './getSpineInfo';
import { loadAtlasAndImage } from './loadAtlasAndImages';
import { SkeletonJsonV2 } from './SkeletonJsonV2';
import { SkeletonBinaryV2 } from './SkeletonBinaryV2';
/* instead of insttall the spine-core@4.1 just use the 4.1 data parsing */
import { SkeletonJsonV41 } from './SkeletonJsonV41';
import { SkeletonBinaryV41 } from './SkeletonBinaryV41';

export async function createSkeletonData(
  wz: WzSpineData,
  prefix: string,
  scale = 1,
) {
  const spineInfo = getSpineInfo(wz);
  if (!spineInfo) {
    return undefined;
  }
  if (spineInfo.type === SpineType.Json) {
    return await createSkeletonFromJson(wz, prefix, spineInfo, scale);
  }
  if (spineInfo.type === SpineType.Binary) {
    return await createSkeletonFromBinary(wz, prefix, spineInfo, scale);
  }
}

export async function createSkeletonFromJson(
  wz: WzSpineData,
  prefix: string,
  info: SpineInfo,
  scale = 1,
): Promise<SkeletonData | null> {
  const hash = `${prefix}/${wz.spine}.skeleton-${scale}`;
  if (Assets.cache.has(hash)) {
    return Assets.cache.get(hash) as SkeletonData;
  }

  const atlas = await loadAtlasAndImage(wz, prefix, info);
  if (!atlas) {
    return null;
  }
  const attachmentLoader = new AtlasAttachmentLoader(atlas);
  const rawJson = wz[info.spineFileName];
  let version: undefined | string[];
  try {
    const json = JSON.parse(rawJson);
    version = getMainVersionFromJson(json);
  } catch (e) {
    return null;
  }
  if (!version) {
    return null;
  }

  const parser =
    version[0] === SpineVersion.V2
      ? new SkeletonJsonV2(attachmentLoader)
      : version[1] === '1'
        ? new SkeletonJsonV41(attachmentLoader)
        : new SkeletonJson(attachmentLoader);
  parser.scale = scale;
  const skeletonData = parser.readSkeletonData(rawJson);

  Assets.cache.set(hash, skeletonData);

  return skeletonData;
}

export async function createSkeletonFromBinary(
  wz: WzSpineData,
  prefix: string,
  info: SpineInfo,
  scale = 1,
) {
  const hash = `${prefix}/${wz.spine}.skeleton-${scale}`;
  if (Assets.cache.has(hash)) {
    return Assets.cache.get(hash) as SkeletonData;
  }
  const atlas = await loadAtlasAndImage(wz, prefix, info);
  if (!atlas) {
    return null;
  }
  const attachmentLoader = new AtlasAttachmentLoader(atlas);
  const rawSkel = await CharacterLoader.getRaw(
    `${prefix}/${info.spineFileName}`,
  ).then((res) => res.arrayBuffer());
  const version = getMainVersionFromBinary(rawSkel);
  if (!version) {
    return null;
  }
  const parser =
    version[0] === SpineVersion.V2
      ? new SkeletonBinaryV2(attachmentLoader)
      : version[1] === '1'
        ? new SkeletonBinaryV41(attachmentLoader)
        : new SkeletonBinary(attachmentLoader);
  parser.scale = scale;
  const skeletonData = parser.readSkeletonData(rawSkel);
  Assets.cache.set(hash, skeletonData);
  return skeletonData;
}
