import { Assets, Sprite, type Texture } from 'pixi.js';
import { $apiHost } from '@/store/const';

import type { Zmap, Smap } from './const/data';
import type { WzItem, WzEffectItem, WzActionInstruction } from './const/wz';
import type { WzNameTag } from '../nameTag/wz';
import type { WzChatBalloon } from '../chatBalloon/wz';
import type { WzMedal } from '../medal/wz';

import { getItemFolderFromId } from '@/utils/itemFolder';
import { isCashEffectId, isNickTagId } from '@/utils/itemId';

class Loader {
  zmap?: Zmap = [];
  smap?: Smap;
  zmapIndex = new Map<string, number>();
  wzImageFolder = new Set<string>();
  setMap = new Map<string, string>();
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
      this.loadSetMap(),
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
    if (!this.zmap) {
      return;
    }
    for (let i = 0; i < this.zmap.length; i++) {
      this.zmapIndex.set(this.zmap[i], i);
    }

    this.zmap.reverse();
    // manually add capBelowHead, wtf?
    this.fixLayers([
      ['capBelowHead', 'armBelowHead'],
      ['capBelowHair', 'hairBelowBody'],
      // why is this keep going
      ['capBackHair', 'hairBelowBody'],
    ]);

    this.zmap.push('effect');
    this.zmapIndex.set('effect', this.zmap.length - 1);
  }
  async loadSmap() {
    this.smap = await fetch(`${this.apiHost}/mapping/smap`).then((res) =>
      res.json(),
    );
  }
  async loadWzImageFolder() {
    this.wzImageFolder = new Set(
      await fetch(`${this.apiHost}/mapping/images?cache=14400`).then((res) =>
        res.json(),
      ),
    );
  }
  async loadSetMap() {
    // id -> setId
    const setData = await fetch(`${this.apiHost}/mapping/seteffect`).then(
      (res) => res.json(),
    );
    this.setMap = new Map(Object.entries(setData));
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
      const frameKeys = Object.keys(instructions)
        .map(Number)
        .filter((n) => !Number.isNaN(n));
      frameKeys.sort((a, b) => a - b);
      for (const frame in frameKeys) {
        const instruction = instructions[frame];
        instruction &&
          frames.push({
            ...instruction,
            delay: Math.abs(instruction.delay || 100),
          });
      }
      this.instructionMap.set(action, frames);
    }
  }
  get apiHost() {
    return $apiHost.get();
  }
  checkPathExist(path: string) {
    const imgPath = (path.split('.img') || [])[0];
    return this.wzImageFolder.has(imgPath);
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
    const padId = id.toString().padStart(8, '0');
    const path = isCashEffectId(id)
      ? `Item/Cash/0501.img/${padId}`
      : isNickTagId(id)
        ? `Item/Install/0370.img/${padId}`
        : `Character/${getfolder}${padId}.img`;

    const exists = this.wzImageFolder.has(path);
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
    // prevent cash effect get loaded wrongly
    if (!path || isCashEffectId(id)) {
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

    let alias = `Effect/ItemEff.img/${id}`;
    if (isCashEffectId(id)) {
      alias = `Item/Cash/0501.img/${id.toString().padStart(8, '0')}`;
    }

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
  async getPieceSetEffectWz<T = WzEffectItem | null>(id: number) {
    const setId = this.setMap.get(id.toString());

    if (!setId) {
      return null;
    }

    const alias = `Effect/SetEff.img/${setId}`;

    const data = await Assets.load<T>({
      alias,
      loadParser: 'loadJson',
      src: `${this.apiHost}/node/json/${alias}/effect?simple=true&cache=14400`,
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
  async getMedalWz(id: number): Promise<WzMedal | null> {
    const path = `UI/NameTag.img/medal/${id}`;
    return await this.getPieceWzByPath<WzMedal>(path);
  }
  async getNickTagWz(id: number): Promise<WzMedal | null> {
    const path = `UI/NameTag.img/nick/${id}`;
    return await this.getPieceWzByPath<WzMedal>(path);
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

  getRaw(path: string) {
    return fetch(`${this.apiHost}/node/raw/${path}?force_parse=true`);
  }

  /**
   * fix certain layer index with one exist layer when it not exist
   */
  private fixLayers(layers: [string, string][]) {
    if (!this.zmap) {
      return;
    }
    for (const [layer, alterLayer] of layers) {
      const alterIndex = this.zmap.indexOf(alterLayer);
      console.log('alterIndex', alterIndex, layer, alterLayer);
      if (alterIndex > -1) {
        this.zmap = [
          ...this.zmap.slice(0, alterIndex),
          layer,
          ...this.zmap.slice(alterIndex),
        ];
        this.zmapIndex.set(layer, this.zmapIndex.get(alterLayer) || 0);
      }
    }
  }
}

export const CharacterLoader = new Loader();
