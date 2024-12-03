import { Assets, Graphics, type UnresolvedAsset } from 'pixi.js';

import type {
  WzMapData,
  WzMapBackInfo,
  WzMapBackFolder,
  WzPngPieceInfo,
} from './const/wz';
import { CharacterLoader } from '../character/loader';
import { MapBack } from './mapBack';
import type { MapleMap } from './map';

export class MapBackSet {
  unprocessedBacks: [WzMapBackInfo, number][] = [];
  layers: [MapBack[], MapBack[]] = [[], []];
  imgUsed = new Set<string>();
  map: MapleMap;
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
    console.log('imgUsed', imgUsed);
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
      if (info.ani && info.ani > 1) {
        continue;
      }
      const backTyep = info.ani === 1 ? 'ani' : 'back';
      const _backData = wz[info.bS]?.[backTyep]?.[info.no];
      if (!_backData) {
        continue;
      }
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
    console.log('textureMap', textureMap);
    this.unprocessedBacks = [];
    await Assets.load(Array.from(textureMap.values()));
    for (const back of this.layers.flat()) {
      back.prepareResource(this.map.size, this.map.renderer);
    }
  }
  putOnMap(mapleMap: MapleMap) {
    // const debugbackGraph = new Graphics();
    // debugbackGraph.rect(0, 0, this.map.size.width, this.map.size.height);
    // debugbackGraph.fill(0x00ff00);
    // debugbackGraph.alpha = 0.5;
    // debugbackGraph.position.set(this.map.edges.left, this.map.edges.top);
    // mapleMap.layers[mapleMap.bottomLayer].addChild(debugbackGraph);
    for (const back of this.layers[0]) {
      if (!back.renderObj) {
        continue;
      }
      // const debugGraph = new Graphics();
      // debugGraph.rect(0, 0, back.size.width, back.size.height);
      // debugGraph.stroke({
      //   color: 0xff0000,
      //   width: 4,
      // });
      // debugGraph.position.copyFrom(back.position);
      // debugGraph.pivot.copyFrom(back.renderObj?.pivot || { x: 0, y: 0 });
      mapleMap.layers[mapleMap.bottomLayer].addChild(back);
      // mapleMap.layers[mapleMap.topLayer].addChild(debugGraph);
    }
    for (const foreground of this.layers[1]) {
      mapleMap.layers[mapleMap.topLayer].addChild(foreground);
    }
  }
}
