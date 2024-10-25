import type { Container } from 'pixi.js';

import { CharacterLoader } from '../character/loader';

import type { WzTamingMobData } from './const/wz';
import type { PieceZ } from '../character/const/data';
import type { Character } from '../character/character';
import { CharacterAction } from '@/const/actions';

import { TamingMobItem } from './tamingMobItem';

export class TamingMob {
  id: number;
  wz?: WzTamingMobData;

  actionItem: Map<CharacterAction, TamingMobItem> = new Map();

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
    const hide1 = !!this.wz?.info?.removeEffect;
    const hide2 = !!this.wz?.info?.removeEffectAll;
    return hide1 || hide2;
  }
  get isHideBody() {
    return !!this.wz?.info?.removeBody;
  }
  async load() {
    if (!this.wz) {
      const data = await CharacterLoader.getPieceWzByPath<WzTamingMobData>(
        `Character/TamingMob/${this.id.toString().padStart(8, '0')}.img`,
      );
      if (data) {
        this.wz = data;
      }
    }

    if (!this.wz) {
      return;
    }
    for (const action of Object.values(CharacterAction)) {
      const item = this.wz[action];
      const defaultAction = this.wz.characterAction?.[action];
      if (item && !this.actionItem.has(action)) {
        this.actionItem.set(
          action,
          new TamingMobItem(action, item, this, defaultAction),
        );
      }
    }
  }
  playFrameOnCharacter(character: Character, frame: number) {
    const item = this.actionItem.get(character.action);
    if (!item) {
      return;
    }
    item.removePreviousFrameParts(frame);
    const pieces = item.getFrameParts(frame);

    for (const piece of pieces) {
      if (piece.destroyed) {
        continue;
      }
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
    character.bodyFrame.pivot.x -= item.navel.x;
    character.bodyFrame.pivot.y -= item.navel.y;
  }
}
