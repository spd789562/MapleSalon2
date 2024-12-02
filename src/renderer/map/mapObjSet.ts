import { Assets, type UnresolvedAsset } from 'pixi.js';

import type {
  WzMapObjTypeFolder,
  WzMapObjData,
  WzMapData,
  WzMapObjInfo,
} from './const/wz';
import { CharacterLoader } from '../character/loader';
import { MapObj } from './mapObj';

const LAYER_COUNT = 16;

export class MapObjSet {
  unprocessedObjs: WzMapObjInfo[][] = [];
  layers: MapObj[][] = [];
  imgUsed = new Set<string>();
  constructor(wz: WzMapData) {
    for (let i = 0; i < LAYER_COUNT; i++) {
      this.layers.push([]);
      this.unprocessedObjs.push([]);
    }
    this.initialize(wz);
  }
  initialize(wz: WzMapData) {
    const numberKeys = Object.keys(wz).map(Number).filter(Number.isInteger);
    for (const layer of numberKeys) {
      const objData = wz[layer];
      if (!objData?.obj) {
        continue;
      }
      for (const obj of Object.values(objData.obj)) {
        this.unprocessedObjs[layer].push(obj);
        this.imgUsed.add(obj.oS);
      }
    }
  }
  async load() {
    const imgUsed = Array.from(this.imgUsed);
    const objWzs = (await Promise.all(
      imgUsed.map((img) =>
        CharacterLoader.getPieceWzByPath(`Map/Obj/${img}.img`),
      ),
    )) as WzMapObjTypeFolder[];
    const wz = imgUsed.reduce(
      (acc, img, i) => {
        acc[img] = objWzs[i];
        return acc;
      },
      {} as Record<string, WzMapObjTypeFolder>,
    );
    const textureMap = new Map<string, UnresolvedAsset>();
    for (let i = 0; i < LAYER_COUNT; i++) {
      const unprocessLayer = this.unprocessedObjs[i] || [];
      for (const obj of unprocessLayer) {
        if ((obj?.flow ?? 0) > 0 || obj?.spineAni) {
          continue;
        }
        const objData = wz[obj.oS]?.[obj.l0]?.[obj.l1]?.[
          obj.l2
        ] as unknown as WzMapObjData;
        if (!objData) {
          continue;
        }
        const mapObj = new MapObj(obj, objData);
        for (const asset of mapObj.resources) {
          textureMap.set(asset.alias as string, asset);
        }
        this.layers[i].push(mapObj);
      }
    }
    this.unprocessedObjs = [];
    await Assets.load(Array.from(textureMap.values()));
    for (const obj of this.layers.flat()) {
      obj.prepareResource();
    }
  }
}
