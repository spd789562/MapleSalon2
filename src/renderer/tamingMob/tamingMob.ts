import { CharacterLoader } from '../character/loader';

import type { WzTamingMobData } from './const/wz';
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
      if (item && !this.actionItem.has(action)) {
        this.actionItem.set(action, new TamingMobItem(action, item, this));
      }
    }
  }
}
