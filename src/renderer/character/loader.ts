import { invoke } from '@tauri-apps/api/core';
import { Assets, Sprite, type Texture } from 'pixi.js';
import { $apiHost } from '@/store/const';

import type { Zmap, Smap } from './const/data';
import type { WzItem } from './const/wz';

import { getItemFolderFromId } from '@/utils/itemFolder';

class Loader {
  zmap?: Zmap;
  smap?: Smap;
  wzImageFolder: string[] = [];

  init() {
    return Promise.all([
      this.loadZmap(),
      this.loadSmap(),
      this.loadWzImageFolder(),
    ]);
  }
  async loadZmap() {
    this.zmap = await fetch(`${this.apiHost}/mapping/zmap`).then((res) =>
      res.json(),
    );
    this.zmap?.reverse();
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
  getPiecePathIfExist(id: number, folder?: string) {
    let getfolder = folder;
    if (!folder) {
      getfolder = getItemFolderFromId(id);
    }
    const path = `Character/${getfolder}${id.toString().padStart(8, '0')}.img`;

    const exists = this.wzImageFolder.includes(path);
    if (!exists) {
      return null;
    }
    return path;
  }
  async getPieceWz(id: number): Promise<WzItem | null> {
    const path = this.getPiecePathIfExist(id);
    if (!path) {
      return null;
    }

    await invoke('parse_node', { path });

    const data: WzItem = await fetch(
      `${this.apiHost}/node/json/${path}?force_parse=true&simple=true&cache=14400&resolve_uol=true`,
    ).then((res) => res.json());

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
