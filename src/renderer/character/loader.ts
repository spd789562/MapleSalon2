import { Assets, Sprite, type Texture } from 'pixi.js';
import { $apiHost } from '@/store/const';

import type { Zmap, Smap } from './const/data';
import type { WzItem, WzEffectItem, WzActionInstruction } from './const/wz';
import type { WzNameTag } from '../nameTag/wz';
import type { WzChatBalloon } from '../chatBalloon/wz';

import { getItemFolderFromId } from '@/utils/itemFolder';

class Loader {
  zmap?: Zmap = [];
  smap?: Smap;
  wzImageFolder: string[] = [];
  loadingMap = new Map<string, Promise<unknown>>();
  pathExistCache = new Map<number, string>();
  instructionMap = new Map<string, WzActionInstruction[]>();
  noEffectMap = new Set<number>();

  init() {
    return Promise.all([
      this.loadZmap(),
      this.loadSmap(),
      this.loadWzImageFolder(),
      this.loadEffect(),
    ])
      .then(() => Promise.all([this.loadNameTag(), this.loadInstructionMap()]))
      .catch((e) => console.log(e));
  }
  async loadEffect() {
    return await fetch(`${this.apiHost}/node/parse/Effect/ItemEff.img`);
  }
  async loadNameTag() {
    return await fetch(`${this.apiHost}/node/parse/UI/NameTag.img`);
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
  async loadInstructionMap() {
    const data = await this.getPieceWzByPath<
      Record<string, Record<string, WzActionInstruction>>
    >('Character/00002000.img');
    if (!data) {
      return;
    }
    for (const action in data) {
      const instructions = data[action];
      /* at lease has two frame */
      if (!instructions || !instructions[0]?.action) {
        continue;
      }
      const frames: WzActionInstruction[] = [];
      for (const frame in instructions) {
        const numberdFrame = Number(frame);
        if (Number.isNaN(numberdFrame)) {
          continue;
        }
        const instruction = instructions[frame];
        frames[numberdFrame] = {
          ...instruction,
          delay: Math.abs(instruction.delay || 100),
        };
      }
      this.instructionMap.set(action, frames);
    }
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
    return await this.getPieceWzByPath<WzItem>(path);
  }
  async getPieceWzByPath<T>(path: string): Promise<T | null> {
    if (!Assets.cache.has(path)) {
      await this.createParsePromise(path);
    } else if (this.loadingMap.get(path)) {
      /* if cache exist and loadingMap has this item, then delete it */
      this.loadingMap.delete(path);
    }

    const data = await Assets.load<T>({
      alias: path,
      loadParser: 'loadJson',
      src: `${this.apiHost}/node/json/${path}?force_parse=true&simple=true&cache=14400`,
    }).catch(() => null);

    return data;
  }
  async getPieceEffectWz<T = WzEffectItem | null>(id: number, inEffect = true) {
    if (this.noEffectMap.has(id)) {
      return null;
    }

    const alias = `Effect/ItemEff.img/${id}`;

    const data = await Assets.load<T>({
      alias,
      loadParser: 'loadJson',
      src: `${this.apiHost}/node/json/${alias}${inEffect ? '/effect' : ''}?simple=true&cache=14400`,
    }).catch(() => {
      this.noEffectMap.add(id);
      return null;
    });

    return data;
  }
  async getNameTagWz(id: number): Promise<WzNameTag | null> {
    const path = `UI/NameTag.img/${id}`;
    return await this.getPieceWzByPath<WzNameTag>(path);
  }
  async getChatBalloonWz(id: number): Promise<WzChatBalloon | null> {
    const path = `UI/ChatBalloon.img/${id}`;
    return await this.getPieceWzByPath<WzChatBalloon>(path);
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
