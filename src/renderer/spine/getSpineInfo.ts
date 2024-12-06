import type { WzSpineData } from './const/wz';
import { SpineType, SpineVersion, type SpineInfo } from './const/type';

import { BinaryInput } from '@esotericsoftware/spine-core/dist/SkeletonBinary';

export function getSpineInfo(wz: WzSpineData): SpineInfo | undefined {
  const spinePrefix = wz.spine as string;
  const normalAtlasName = `${spinePrefix}.atlas`;
  let atlasName = normalAtlasName;
  if (!wz[normalAtlasName] && wz.atlas) {
    atlasName = 'atlas';
  }
  const normalSpineName = `${spinePrefix}.json`;
  if (wz[normalSpineName]) {
    return {
      type: SpineType.Json,
      spineFileName: normalSpineName,
      atlasFileName: atlasName,
    };
  }
  const skelSpineName = `${spinePrefix}.skel`;
  if (wz[skelSpineName]) {
    return {
      type: SpineType.Binary,
      spineFileName: skelSpineName,
      atlasFileName: atlasName,
    };
  }
  if (wz[spinePrefix]) {
    const type = (wz[spinePrefix] as { duration?: number }).duration
      ? SpineType.Binary
      : SpineType.Json;
    return {
      type,
      spineFileName: spinePrefix,
      atlasFileName: atlasName,
    };
  }
}

export function getMainVersionFromJson(json: {
  skeleton?: { spine: string };
  spine?: string;
}): SpineVersion | undefined {
  const version = json.skeleton ? json.skeleton.spine : json.spine;
  if (!version) {
    return undefined;
  }
  const major = version.split('.')[0];
  switch (major) {
    case '2':
      return SpineVersion.V2;
    case '3':
      return SpineVersion.V3;
    case '4':
      return SpineVersion.V4;
    default:
      break;
  }
  return undefined;
}

export function getMainVersionFromBinary(
  buffer: ArrayBuffer,
): SpineVersion | undefined {
  const input = new BinaryInput(buffer);
  return getMainVersionFromV4skel(input) ?? getMainVersionFromV3skel(input);
}

function getMainVersionFromV4skel(
  input: BinaryInput,
): SpineVersion | undefined {
  /* @ts-ignore */
  const pos = input.index as number;
  // skip hash
  input.readInt32();
  input.readInt32();
  /* @ts-ignore */
  const stringPos = input.index as number;
  const stringLen = input.readInt(true);
  if (stringLen <= 13) {
    /* @ts-ignore */
    input.index = stringPos;
    const version = input.readString() ?? '';
    const major = version?.substring(0, 1);
    if (major === '4') {
      return SpineVersion.V4;
    }
    if (major === '2') {
      return SpineVersion.V2;
    }
  }
  /* @ts-ignore */
  input.index = pos;
  return undefined;
}

function getMainVersionFromV3skel(
  input: BinaryInput,
): SpineVersion | undefined {
  const hashLen = input.readInt(true);
  // skip hash
  if (hashLen > 1) {
    /* @ts-ignore */
    input.index += hashLen - 1;
  }
  // version len
  input.readInt(true);
  const major = input.readUnsignedByte();
  if (major === 50) {
    return SpineVersion.V2;
  }
  if (major === 51) {
    return SpineVersion.V3;
  }

  return undefined;
}
