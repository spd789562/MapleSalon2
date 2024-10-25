import { Assets, type Container, type UnresolvedAsset } from 'pixi.js';

import { CharacterLoader } from '../character/loader';

import type {
  WzChairData,
  WzChairEffectSets,
  WzChairEffectItem,
} from './const/wz';
import type { PieceZ } from '../character/const/data';
import type { Character } from '../character/character';
import { ChairEffectItem } from './chairEffectItem';

const effectReg = /effect[0-9]?/; // effect, effect1, ...

export class TamingMob {
  id: number;
  wz?: WzChairData;
  items: ChairEffectItem[] = [];

  constructor(id: number) {
    this.id = id;
  }
  get isChair() {
    return !!this.wz?.sit;
  }
  get isHideWeapon() {
    return !!this.wz?.info?.invisibleWeapon;
  }
  get isHideCape() {
    return !!this.wz?.info?.invisibleCape;
  }
  get isHideEffect() {
    const hide1 = !!this.wz?.info?.removeEffectAll;
    const hide2 = !!this.wz?.info?.removeEffectBodyParts;
    return hide1 || hide2;
  }
  get isHideBody() {
    return !!this.wz?.info?.removeBody;
  }
  async load() {
    if (!this.wz) {
      const data = await CharacterLoader.getPieceWzByPath<WzChairData>(
        `Character/TamingMob/${this.id.toString().padStart(8, '0')}.img`,
      );
      if (data) {
        this.wz = data;
      }
    }

    if (!this.wz) {
      return;
    }

    let root: WzChairEffectSets = this.wz;
    // if something looks like a id, use it as root
    const idKey = Object.keys(this.wz).find(
      (key) => !Number.isNaN(Number(key)),
    );
    if (idKey) {
      root = this.wz[idKey];
    }

    const items: ChairEffectItem[] = [];

    for (const key in this.wz) {
      if (effectReg.test(key)) {
        const effectData = root[
          key as keyof WzChairEffectSets
        ] as WzChairEffectItem;
        items.push(new ChairEffectItem(key, effectData));
      }
    }

    this.items = items;
  }

  async loadResourceByFrame(index: number) {
    const assets = [] as UnresolvedAsset[];

    for (const item of this.items) {
      const targetFrame = item.frames[index % item.frames.length];
      targetFrame && assets.push(...(targetFrame.resources || []));
    }

    assets.length > 0 && (await Assets.load(assets));
  }
  async loadResource() {
    const assets = this.items
      .flatMap((part) => part.frames)
      .flatMap((frame) => frame.resources)
      .filter(Boolean) as UnresolvedAsset[];
    await Assets.load(assets);
  }
  playFrameOnCharacter(character: Character, frame: number) {
    for (const item of this.items) {
      item.removePreviousFrameParts(frame);
      const piece = item.getFramePart(frame);
      if (piece) {
        const zmap = CharacterLoader?.zmap;
        if (!zmap) {
          return;
        }
        const z = piece.frameData.z;
        let container: Container;
        if (typeof z === 'string') {
          container = character.getOrCreatZmapLayer(zmap, z as PieceZ);
        } else {
          container = character.getOrCreatEffectLayer(z);
        }
        container.addChild(piece);
      }
    }
  }
}
