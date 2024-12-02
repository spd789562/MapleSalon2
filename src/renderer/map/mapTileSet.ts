import {
  Container,
  type PointData,
  Assets,
  Sprite,
  type UnresolvedAsset,
} from 'pixi.js';

import type { WzMapTileInfo, WzMapTileFolder } from './const/wz';
import { CharacterLoader } from '../character/loader';

export interface TileItem {
  name: string;
  x: number;
  y: number;
}

export class MapTileSet extends Container {
  imgName: string;
  /** contains '{tS}.img/{u}/{no}' */
  tileNames: Map<string, PointData> = new Map();
  tiles: TileItem[] = [];
  wz: WzMapTileFolder | null = null;
  constructor(imgName: string, wz: Record<number, WzMapTileInfo>) {
    super();
    this.imgName = imgName;
    this.initialize(wz);
  }
  initialize(wz: Record<number, WzMapTileInfo>) {
    const numberKeys = Object.keys(wz).map(Number).filter(Number.isInteger);
    numberKeys.sort((a, b) => a - b);
    for (const key of numberKeys) {
      const tile = wz[key];
      const name = `Map/Tile/${this.imgName}.img/${tile.u}/${tile.no}`;
      const point = {
        x: tile.x ?? 0,
        y: tile.y ?? 0,
      };
      if (!this.tileNames.has(name)) {
        this.tileNames.set(name, {
          x: point.x,
          y: point.y,
        });
      }
      this.tiles.push({
        name,
        x: point.x ?? 0,
        y: point.y ?? 0,
      });
    }
  }
  async load() {
    if (!this.wz) {
      this.wz = await CharacterLoader.getPieceWzByPath(
        `Map/Tile/${this.imgName}.img`,
      );
    }
    if (!this.wz) {
      return;
    }
    for (const [folderName, folder] of Object.entries(this.wz)) {
      const hasPng =
        folder && Object.keys(folder).some((key) => folder[key].origin);
      if (!hasPng) {
        continue;
      }
      for (const [tileName, tile] of Object.entries(folder)) {
        const name = `Map/Tile/${this.imgName}.img/${folderName}/${tileName}`;
        const tileItem = this.tileNames.get(name);
        if (tileItem) {
          tileItem.x = tile.origin?.x ?? 0;
          tileItem.y = tile.origin?.y ?? 0;
        }
      }
    }
  }
  async prepareResource() {
    const resources = Array.from(this.tileNames.keys()).map(
      (name) =>
        ({
          alias: name,
          src: CharacterLoader.getPieceUrl(name),
          loadParser: 'loadTextures',
          format: '.webp',
        }) as UnresolvedAsset,
    );
    await Assets.load(resources);
    this.renderTile();
  }
  renderTile() {
    for (const { name, x, y } of this.tiles) {
      const spriteOrigin = this.tileNames.get(name);
      const sprite = Sprite.from(Assets.get(name));
      if (spriteOrigin) {
        sprite.pivot.set(spriteOrigin.x, spriteOrigin.y);
      }
      sprite.position.set(x, y);
      this.addChild(sprite);
    }
  }
}
