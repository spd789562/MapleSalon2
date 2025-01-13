import { Container } from 'pixi.js';

import type { PieceSlot } from './const/data';
import type { CharacterAnimatablePart } from './characterAnimatablePart';
import type { CharacterStaticPart } from './characterStaticPart';
import type { Character } from './character';

import { CharacterLoader } from './loader';

export class CharacterZmapContainer extends Container {
  name: PieceSlot;
  character: Character;
  requireLocks: PieceSlot[];
  _originzIndex: number;

  constructor(name: PieceSlot, index: number, character: Character) {
    super();
    this.name = name;
    this.zIndex = index;
    this._originzIndex = CharacterLoader.zmapIndex.get(name) || 0;
    this.character = character;
    this.requireLocks = [];

    // part of this logic is from maplestory.js
    if (this.name === 'mailArm') {
      this.requireLocks = ['Ma'];
    } else if (this.name === 'backHead') {
      /* backHead some how use ['Bd'] so force change it */
      this.requireLocks = ['Hd'];
    } else if (this.name === 'pants' || this.name === 'backPants') {
      this.requireLocks = ['Pn'];
    } else {
      this.requireLocks =
        (CharacterLoader.smap?.[name] || '').match(/.{1,2}/g) || [];
    }
  }
  addCharacterPart(child: CharacterAnimatablePart | CharacterStaticPart) {
    this.addChild(child);
    // this.refreshLock();
  }
  hasAllLocks(id: number, locks: string[]) {
    return locks.every((lock) => {
      const requiredLock = this.character.locks.get(lock);
      return !requiredLock || requiredLock === id;
    });
  }
  refreshLock() {
    for (const child of this.children) {
      const part = child as CharacterAnimatablePart;
      if (!part.item) {
        continue;
      }
      // using the fewer locks, but seems not right.
      // let locks =
      //   frame.item.vslot.length < this.requireLocks.length
      //     ? frame.item.vslot
      //     : this.requireLocks;
      let locks = this.requireLocks;
      const itemMainLocks = part.item.islot; // something like Ma, Pn,Cp

      // force Cap using vslot
      if (itemMainLocks.includes('Cp')) {
        locks = part.item.vslot;
      } else if (
        itemMainLocks.length === 1 &&
        itemMainLocks[0] === 'Hd' &&
        (this.name === 'accessoryOverHair' || this.name === 'hairShade')
      ) {
        /* try to fix ear rendering */
        locks = ['Hd'];
      }

      // this logic is from maplestory.js, but why
      if (this.name === 'mailChest') {
        locks = part.item.vslot;
      }

      const hasSelfLock = this.hasAllLocks(part.item.info.id, part.item.vslot);
      const hasLayerLock = this.hasAllLocks(part.item.info.id, locks);

      // as long as one of the lock is ok, show the part
      if (hasSelfLock || hasLayerLock) {
        child.visible = true;
      } else {
        child.visible = false;
      }
    }
  }
}
