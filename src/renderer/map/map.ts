import { Container } from 'pixi.js';

import type { WzMapData } from './const/wz';
import { CharacterLoader } from '../character/loader';
import { MapTileSet } from './mapTileSet';
import { MapObjSet } from './mapObjSet';

const LAYER_COUNT = 16;
const BOTTOM_LAYER = 0;
const CHARACTER_LAYER = 5;
const TOP_LAYER = 15;

export class MapleMap extends Container {
  id: string;
  wz: WzMapData | null = null;
  layers: Container[] = [];
  constructor(id: string) {
    super();
    this.id = id;
    this.sortableChildren = true;
    for (let i = 0; i < LAYER_COUNT; i++) {
      const layer = new Container();
      layer.sortableChildren = true;
      this.layers.push(layer);
      this.addChild(layer);
    }
  }
  async load() {
    if (!this.wz) {
      const parentMapSuffix = this.id.slice(0, 1);
      this.wz = await CharacterLoader.getPieceWzByPath(
        `Map/Map/Map${parentMapSuffix}/${this.id}.img`,
      );
    }
    if (!this.wz) {
      return;
    }
    await this.loadTileSet(this.wz);
    await this.loadObjSet(this.wz);
    this.position.set(-2000, -300);
  }
  async loadTileSet(wz: WzMapData) {
    const sets: Record<number, MapTileSet> = {};
    const numberKeys = Object.keys(wz).map(Number).filter(Number.isInteger);
    for (const layer of numberKeys) {
      const setInfo = wz[layer]?.info?.tS;
      if (wz[layer]?.tile && setInfo) {
        sets[layer] = new MapTileSet(setInfo, wz[layer].tile);
      }
    }
    await Promise.all(Object.values(sets).map((set) => set.load()));
    await Promise.all(Object.values(sets).map((set) => set.prepareResource()));
    for (const layer of numberKeys) {
      const set = sets[layer];
      if (!set) {
        continue;
      }
      const container = this.layers[layer + 1];
      container.addChild(set);
    }
  }
  async loadObjSet(wz: WzMapData) {
    const objSet = new MapObjSet(wz);
    await objSet.load();
    for (let i = 0; i < LAYER_COUNT; i++) {
      const layer = objSet.layers[i];
      for (const obj of layer) {
        this.layers[i + 1].addChild(obj);
      }
    }
  }
}
