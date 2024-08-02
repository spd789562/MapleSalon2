import { Assets, Sprite, type Texture } from 'pixi.js';
import { $apiHost } from '@/store/const';

import type { Zmap, Smap } from './const/data';
import type { WzItem, WzEffectItem } from './const/wz';

import { getItemFolderFromId } from '@/utils/itemFolder';

class Loader {
  zmap?: Zmap = [];
  smap?: Smap;
  wzImageFolder: string[] = [];
  loadingMap = new Map<string, Promise<unknown>>();
  pathExistCache = new Map<number, string>();

  init() {
    return Promise.all([
      this.loadZmap(),
      this.loadSmap(),
      this.loadWzImageFolder(),
      this.loadEffect(),
    ]);
  }
  async loadEffect() {
    return await fetch(`${this.apiHost}/node/parse/Effect/ItemEff.img`);
  }
  async loadZmap() {
    this.zmap = await fetch(`${this.apiHost}/mapping/zmap`).then((res) =>
      res.json(),
    );
    this.zmap?.reverse();
    this.zmap?.push('effect');
  }
  async loadSmap() {
    this.smap = await fetch(`${this.apiHost}/mapping/smap`).then((res) =>
      res.json(),
    );
  }
  async loadWzImageFolder() {
    this.wzImageFolder = await fetch(
      `${this.apiHost}/mapping/images?cache=14400`,
    )
      .then((res) => res.json())
      .then((data: string[]) =>
        data.filter((path) => path.startsWith('Character')),
      );
  }
  get apiHost() {
    return $apiHost.get();
  }
  checkPathExist(path: string) {
    const imgPath = (path.split('.img') || [])[0];
    return this.wzImageFolder.includes(imgPath);
  }
  getPiecePathIfExist(id: number, folder?: string) {
    let getfolder = folder;
    if (!folder) {
      getfolder = getItemFolderFromId(id);
    }
    const existPath = this.pathExistCache.get(id);
    if (existPath) {
      return existPath;
    }
    const path = `Character/${getfolder}${id.toString().padStart(8, '0')}.img`;

    const exists = this.wzImageFolder.includes(path);
    this.pathExistCache.set(id, exists ? path : '');
    if (!exists) {
      return null;
    }
    return path;
  }
  createParsePromise(path: string) {
    const current = this.loadingMap.get(path);
    if (current) {
      return current;
    }

    const promise = Assets.load<unknown>({
      alias: `parse/${path}`,
      loadParser: 'loadJson',
      src: `${this.apiHost}/node/parse/${path}`,
    }).catch(() => null);

    this.loadingMap.set(path, promise);
    return promise;
  }
  async getPieceWz(id: number): Promise<WzItem | null> {
    const path = this.getPiecePathIfExist(id);
    if (!path) {
      return null;
    }
    return await this.getPieceWzByPath(path);
  }
  async getPieceWzByPath(path: string): Promise<WzItem | null> {
    if (!Assets.cache.has(path)) {
      await this.createParsePromise(path);
    } else if (this.loadingMap.get(path)) {
      /* if cache exist and loadingMap has this item, then delete it */
      this.loadingMap.delete(path);
    }

    const data = await Assets.load<WzItem>({
      alias: path,
      loadParser: 'loadJson',
      src: `${this.apiHost}/node/json/${path}?force_parse=true&simple=true&cache=14400`,
    }).catch(() => null);

    return data;
  }
  async getPieceEffectWz(id: number): Promise<WzEffectItem | null> {
    const alias = `Effect/ItemEff.img/${id}`;

    const data = await Assets.load<WzEffectItem>({
      alias,
      loadParser: 'loadJson',
      src: `${this.apiHost}/node/json/${alias}/effect?simple=true&cache=14400`,
    }).catch(() => null);

    return data;
  }

  getPieceUrl(path: string) {
    return `${this.apiHost}/node/image/${path}?force_parse=true&cache=7200`;
  }

  async getPieceSprite(path: string) {
    const texture = await Assets.load<Texture>({
      src: this.getPieceUrl(path),
      loader: 'loadTextures',
    });
    return Sprite.from(texture);
  }
}

export const CharacterLoader = new Loader();
