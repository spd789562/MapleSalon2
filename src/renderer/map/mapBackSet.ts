import { Assets, type UnresolvedAsset } from 'pixi.js';

import type {
  WzMapData,
  WzMapBackInfo,
  WzMapBackFolder,
  WzPngPieceInfo,
} from './const/wz';
import type { WzSpineData } from '../spine/const/wz';
import { CharacterLoader } from '../character/loader';
import { MapBack } from './mapBack';
import type { MapleMap } from './map';
import { createSkeletonData } from '../spine/createSkeletonData';

export class MapBackSet {
  unprocessedBacks: [WzMapBackInfo, number][] = [];
  layers: [MapBack[], MapBack[]] = [[], []];
  imgUsed = new Set<string>();
  map: MapleMap;
  showTagItems = false;
  constructor(wz: WzMapData, map: MapleMap) {
    this.initialize(wz);
    this.map = map;
  }
  initialize(wz: WzMapData) {
    const numberKeys = Object.keys(wz.back || {})
      .map(Number)
      .filter(Number.isInteger);
    for (const layer of numberKeys) {
      const backInfo = wz.back[layer];
      if (!backInfo) {
        continue;
      }
      this.imgUsed.add(backInfo.bS);
      this.unprocessedBacks.push([backInfo, layer]);
    }
  }
  async load() {
    const imgUsed = Array.from(this.imgUsed);
    const objWzs = (await Promise.all(
      imgUsed.map((img) =>
        CharacterLoader.getPieceWzByPath(`Map/Back/${img}.img`),
      ),
    )) as WzMapBackFolder[];
    const wz = imgUsed.reduce(
      (acc, img, i) => {
        acc[img] = objWzs[i];
        return acc;
      },
      {} as Record<string, WzMapBackFolder>,
    );
    const textureMap = new Map<string, UnresolvedAsset>();
    for (const [info, zIndex] of this.unprocessedBacks) {
      if (!this.showTagItems && info.backTags) {
        continue;
      }
      const backTyep =
        info.ani === 1 ? 'ani' : info.ani === 2 ? 'spine' : 'back';
      const _backData = wz[info.bS]?.[backTyep]?.[info.no];
      if (!_backData) {
        continue;
      }
      if (info.ani === 2) {
        const backObj = new MapBack(
          info,
          {
            0:
              (_backData as WzSpineData)['0'] ||
              (_backData as WzSpineData['skeleton']),
          },
          zIndex,
          this,
        );
        const prefix = `Map/Back/${info.bS}.img/spine/${info.no}`;
        const data = await createSkeletonData(_backData as WzSpineData, prefix);
        if (data) {
          backObj.skeletonData = data;
          const layer = info.front === 1 ? 1 : 0;
          this.layers[layer].push(backObj);
        }
      } else {
        const backData =
          info.ani === 1
            ? (_backData as Record<number, WzPngPieceInfo>)
            : {
                0: _backData as WzPngPieceInfo,
              };
        const backObj = new MapBack(info, backData, zIndex, this);
        for (const asset of backObj.resources) {
          textureMap.set(asset.alias as string, asset);
        }
        const layer = info.front === 1 ? 1 : 0;
        this.layers[layer].push(backObj);
      }
    }
    this.unprocessedBacks = [];
    await Assets.load(Array.from(textureMap.values()));
    for (const back of this.layers.flat()) {
      back.prepareResource(this.map.renderer);
    }
  }
  putOnMap(mapleMap: MapleMap) {
    for (const back of this.layers[0]) {
      if (!back.renderObj) {
        continue;
      }
      mapleMap.layers[mapleMap.bottomLayer].addChild(back);
    }
    for (const foreground of this.layers[1]) {
      mapleMap.layers[mapleMap.topLayer].addChild(foreground);
    }
  }
  destroy() {
    for (const back of this.layers.flat()) {
      back.destroy();
    }
    this.layers = [[], []];
    this.imgUsed.clear();
    /* @ts-ignore */
    this.map = null;
  }
}
