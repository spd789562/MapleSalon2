import { Assets, Container, type UnresolvedAsset } from 'pixi.js';

import type {
  WzMapObjTypeFolder,
  WzMapObjData,
  WzMapData,
  WzMapObjInfo,
} from './const/wz';
import { CharacterLoader } from '../character/loader';
import type { MapleMap } from './map';
import { MapObj } from './mapObj';
import { createSkeletonData } from '../spine/createSkeletonData';
import type { WzSpineData } from '../spine/const/wz';

const LAYER_COUNT = 14;

export class MapObjSet {
  unprocessedObjs: WzMapObjInfo[][] = [];
  layers: MapObj[][] = [];
  layerContainers: Container[] = [];
  imgUsed = new Set<string>();
  constructor(wz: WzMapData) {
    for (let i = 0; i < LAYER_COUNT; i++) {
      this.layers.push([]);
      const container = new Container();
      container.sortableChildren = true;
      this.layerContainers.push(container);
      this.unprocessedObjs.push([]);
    }
    this.initialize(wz);
  }
  get tags() {
    return this.layers
      .flat()
      .map((obj) => obj.info.tags)
      .filter(Boolean) as string[];
  }
  initialize(wz: WzMapData) {
    const numberKeys = Object.keys(wz).map(Number).filter(Number.isInteger);
    for (const layer of numberKeys) {
      const objData = wz[layer];
      if (!objData?.obj) {
        continue;
      }
      for (const [id, obj] of Object.entries(objData.obj)) {
        this.unprocessedObjs[layer].push({
          ...obj,
          id: Number(id),
        });
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
    const skeletonPromises: (() => Promise<void>)[] = [];
    for (let i = 0; i < LAYER_COUNT; i++) {
      const unprocessLayer = this.unprocessedObjs[i] || [];
      for (const obj of unprocessLayer) {
        if ((obj?.flow ?? 0) > 0 || obj?.hide === 1) {
          continue;
        }
        const objData = wz[obj.oS]?.[obj.l0]?.[obj.l1]?.[
          obj.l2
        ] as unknown as WzMapObjData;
        if (!objData) {
          continue;
        }
        if ('spineAni' in obj) {
          const mapObj = new MapObj(obj, objData, obj.id || 0);
          const prefix = `Map/Obj/${obj.oS}.img/${obj.l0}/${obj.l1}/${obj.l2}`;
          skeletonPromises.push(async () => {
            const skeletonData = await createSkeletonData(
              objData as WzSpineData,
              prefix,
            );
            if (skeletonData) {
              mapObj.skeletonData = skeletonData;
              this.layers[i].push(mapObj);
              this.layerContainers[i].addChild(mapObj);
            }
          });
        } else {
          const mapObj = new MapObj(obj, objData, obj.id || 0);
          for (const asset of mapObj.resources) {
            textureMap.set(asset.alias as string, asset);
          }
          this.layers[i].push(mapObj);
          this.layerContainers[i].addChild(mapObj);
        }
      }
    }
    this.unprocessedObjs = [];
    await Promise.all(skeletonPromises);
    await Assets.load(Array.from(textureMap.values()));
    for (const obj of this.layers.flat()) {
      obj.prepareResource();
    }
  }
  putOnMap(mapleMap: MapleMap) {
    for (let i = 0; i < LAYER_COUNT; i++) {
      const layer = this.layers[i];
      const container = this.layerContainers[i];
      if (layer.length > 0) {
        mapleMap.layers[i + 1].addChild(container);
      }
    }
  }
  toggleVisibilityByTags(disableTags: string[]) {
    for (const obj of this.layers.flat()) {
      if (!obj.info.tags) {
        continue;
      }
      obj.visible = !disableTags.includes(obj.info.tags);
    }
  }
  destroy() {
    for (const obj of this.layers.flat()) {
      obj.destroy();
    }
    for (const container of this.layerContainers) {
      container.destroy();
    }
    this.layers = [];
    this.imgUsed.clear();
  }
}
