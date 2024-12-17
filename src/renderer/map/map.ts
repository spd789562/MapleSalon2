import {
  Container,
  Rectangle,
  type DestroyOptions,
  type Renderer,
} from 'pixi.js';
import type { Viewport } from 'pixi-viewport';

import type { WzMapData } from './const/wz';
import { CharacterLoader } from '../character/loader';
import { MapTileSet } from './mapTileSet';
import { MapObjSet } from './mapObjSet';
import { MapBackSet } from './mapBackSet';
import { MapParticleSet } from './mapParticleSet';

const LAYER_COUNT = 17;
const BOTTOM_LAYER = 0;
const TOP_LAYER = 15;
const PARTICLE_LAYER = 16;

export class MapleMap extends Container {
  id: string;
  wz: WzMapData | null = null;
  layers: Container[] = [];
  renderer: Renderer;
  viewport: Viewport;
  readonly bottomLayer = BOTTOM_LAYER;
  readonly topLayer = TOP_LAYER;
  edge = new Rectangle();
  tileSets: Record<number, MapTileSet> = {};
  objSet?: MapObjSet;
  backSet?: MapBackSet;
  particleSet?: MapParticleSet;

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
  get tags() {
    const set = new Set<string>(
      (this.objSet?.tags || []).concat(this.particleSet?.tags || []),
    );
    return Array.from(set);
  }
  get backTags() {
    const set = new Set<string>(
      (this.backSet?.tags || []).concat(this.particleSet?.tags || []),
    );
    return Array.from(set);
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

    await this.loadObjSet(this.wz);
    await this.loadTileSet(this.wz);
    await this.loadBackSet(this.wz);
    await this.loadParticleSet(this.wz);
  }
  setMapBound(wz: WzMapData) {
    const widthByEdge = (wz.info?.VRRight || 0) - (wz.info?.VRLeft || 0);
    const heightByEdge = (wz.info?.VRTop || 0) - (wz.info?.VRBottom || 0);
    const width = Math.max(wz.miniMap?.width || 0, widthByEdge);
    const height = Math.max(wz.miniMap?.height || 0, heightByEdge);

    this.edge.x = Math.min(-(wz.miniMap?.centerX || 0), wz.info?.VRLeft || 0);
    this.edge.y = Math.min(-(wz.miniMap?.centerY || 0), wz.info?.VRTop || 0);
    this.edge.width = width;
    this.edge.height = height;
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
  async loadParticleSet(wz: WzMapData) {
    if (!wz.particle) {
      return;
    }
    const particleSet = new MapParticleSet(wz.particle, this);
    await particleSet.load();
    this.layers[PARTICLE_LAYER].addChild(particleSet);
  }
  toggleVisibilityByTags(tags: string[], back = false) {
    if (back) {
      this.backSet?.toggleVisibilityByTags(tags);
    } else {
      this.objSet?.toggleVisibilityByTags(tags);
    }
    this.particleSet?.toggleVisibilityByTags(tags, back);
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
    for (const layer of this.layers) {
      layer.destroy();
    }
    /* @ts-ignore */
    this.tileSets = null;
    this.objSet?.destroy();
    this.backSet?.destroy();
    this.particleSet?.destroy();
  }
}
