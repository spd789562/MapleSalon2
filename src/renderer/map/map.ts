import { Container, type DestroyOptions, type Renderer } from 'pixi.js';
import type { Viewport } from 'pixi-viewport';

import type { WzMapData } from './const/wz';
import { CharacterLoader } from '../character/loader';
import { MapTileSet } from './mapTileSet';
import { MapObjSet } from './mapObjSet';
import { MapBackSet } from './mapBackSet';

const LAYER_COUNT = 16;
const BOTTOM_LAYER = 0;
const TOP_LAYER = 15;

export class MapleMap extends Container {
  id: string;
  wz: WzMapData | null = null;
  layers: Container[] = [];
  renderer: Renderer;
  viewport: Viewport;
  readonly bottomLayer = BOTTOM_LAYER;
  readonly topLayer = TOP_LAYER;
  edges = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
  size = {
    width: 800,
    height: 600,
  };
  tileSets: Record<number, MapTileSet> = {};
  objSet?: MapObjSet;
  backSet?: MapBackSet;

  constructor(id: string, renderer: Renderer, viewport: Viewport) {
    super();
    this.id = id;
    // this.sortableChildren = true;
    this.renderer = renderer;
    this.viewport = viewport;
    for (let i = 0; i < LAYER_COUNT; i++) {
      const layer = new Container();
      layer.sortableChildren = true;
      layer.zIndex = i;
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
    this.setMapBound(this.wz);

    await this.loadTileSet(this.wz);
    await this.loadObjSet(this.wz);
    await this.loadBackSet(this.wz);
  }
  setMapBound(wz: WzMapData) {
    this.size.width = wz.miniMap?.width || this.edges.right - this.edges.left;
    this.size.height = wz.miniMap?.height || this.edges.bottom - this.edges.top;
    this.edges.top = wz.miniMap ? -wz.miniMap.centerY : this.edges.top;
    this.edges.left = wz.miniMap ? -wz.miniMap.centerX : this.edges.left;
    this.edges.bottom = wz.miniMap
      ? this.edges.top + this.size.height
      : this.edges.bottom;
    this.edges.right = wz.miniMap
      ? this.edges.left + this.size.width
      : this.edges.right;
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
    this.tileSets = sets;
  }
  async loadObjSet(wz: WzMapData) {
    const objSet = new MapObjSet(wz);
    this.objSet = objSet;
    await objSet.load();
    objSet.putOnMap(this);
  }
  async loadBackSet(wz: WzMapData) {
    const backSet = new MapBackSet(wz, this);
    this.backSet = backSet;
    await backSet.load();
    backSet.putOnMap(this);
  }
  destroy(options?: DestroyOptions): void {
    super.destroy(options);
    for (const layer in this.tileSets) {
      const set = this.tileSets[layer];
      if (!set) {
        continue;
      }
      set.destroy();
      /* @ts-ignore */
      this.tileSets[layer] = null;
    }
    /* @ts-ignore */
    this.tileSets = null;
    this.objSet?.destroy();
    this.backSet?.destroy();
  }
}
