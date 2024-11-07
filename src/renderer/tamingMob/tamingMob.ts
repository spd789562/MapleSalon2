import { Container, Ticker } from 'pixi.js';

import type { CharacterData } from '@/store/character/store';
import { CharacterLoader } from '../character/loader';

import type { Vec2 } from './const/data';
import type { WzTamingMobData } from './const/wz';
import type { Zmap } from '../character/const/data';
import type { Character } from '../character/character';
import type { Chair } from '../chair/chair';
import { CharacterAction } from '@/const/actions';

import { TamingMobItem } from './tamingMobItem';

export class TamingMob extends Container {
  id: number;
  wz?: WzTamingMobData;

  _hideBody = false;

  action = CharacterAction.Stand1;
  actionItem: Map<CharacterAction, TamingMobItem> = new Map();

  characters: [Character, CharacterData][] = [];
  tamingMobLayers = new Map<number, Container>();
  currentNavel = { x: 0, y: 0 };

  /* delta to calculate is need enter next frame */
  currentDelta = 0;
  currentTicker?: (delta: Ticker) => void;
  instructionFrame = 0;
  currentItem?: TamingMobItem;

  isPlaying = false;

  constructor(id: number) {
    super();
    this.id = id;
    this.sortableChildren = true;
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
    return !!this.wz?.info?.removeBody || this._hideBody;
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

    if (!(this.wz && this.actionItem.size === 0)) {
      return;
    }
    for (const action of Object.values(CharacterAction)) {
      const item = this.wz[action];
      const defaultAction = this.wz.characterAction?.[action];
      const isHideBodyAction =
        (defaultAction as unknown as string) === 'hideBody';
      if (isHideBodyAction) {
        this._hideBody = true;
      }

      if (item && !this.actionItem.has(action)) {
        this.actionItem.set(
          action,
          new TamingMobItem(
            action,
            item,
            this,
            isHideBodyAction ? CharacterAction.Sit : defaultAction,
          ),
        );
      }
    }
  }
  /**
   * @usage 
    ```ts
    await tamingMob.load();
    await tamingMob.sitCharacter([
      [ch, data],
    ]);
    ```
  */
  async sitCharacter(characters: [Character, CharacterData][]) {
    // only do one character currently
    const characterAction = characters[0][1].action;
    const tamingMobItem = this.actionItem.get(characterAction);

    if (!tamingMobItem) {
      return;
    }
    this.action = characterAction;
    this.currentItem = tamingMobItem;

    await tamingMobItem.loadResource();

    this.characters = characters;

    const character = characters[0][0];
    character.customInstructions = tamingMobItem.instructions;
    if (this.isHideBody) {
      character.isHideBody = true;
    } else {
      character.isHideBody = false;
    }

    await character.update({
      ...characters[0][1],
      isAnimating: false,
    });

    const characterContainer = this.getOrCreatEffectLayer(40);
    characterContainer.addChild(character);

    this.playFrame();
  }
  playByInstructions() {
    const character = this.characters[0]?.[0];
    if (!character || this.isPlaying) {
      return;
    }
    const maxFrame = character.currentInstructions.length;
    this.isPlaying = true;
    this.playFrame();
    this.currentTicker = (delta) => {
      const currentDuration =
        character.currentInstructions[this.instructionFrame]?.delay || 100;
      this.currentDelta += delta.deltaMS;
      if (this.currentDelta > currentDuration) {
        this.currentDelta %= currentDuration;
        if (this.instructionFrame + 1 >= maxFrame) {
          this.instructionFrame = 0;
        } else {
          this.instructionFrame += 1;
        }
        this.playFrame();
      }
    };
    Ticker.shared.add(this.currentTicker);
  }
  playFrame() {
    const character = this.characters[0]?.[0];
    const zmap = CharacterLoader?.zmap;

    if (!(character && this.currentItem && zmap)) {
      return;
    }
    character.instructionFrame = this.instructionFrame;
    character.playBodyFrame();

    const frame = this.instructionFrame;

    this.currentItem.removePreviousFrameParts(frame);
    const pieces = this.currentItem.getFrameParts(frame);
    const frameNavel = this.currentItem.getFrameNavel(frame);

    character.bodyContainer.position.set(
      frameNavel.x + character.bodyFrame.pivot.x,
      frameNavel.y + character.bodyFrame.pivot.y,
    );

    for (const piece of pieces) {
      if (piece.destroyed) {
        continue;
      }
      const z = piece.frameData.z || -1;
      const container = this.getOrCreatEffectLayer(z, zmap);
      container.addChild(piece);
    }
    this.currentItem.isAncherForChair &&
      this.fixChairAncherIfExist({
        x: -frameNavel.x,
        y: -frameNavel.y,
      });
  }
  stop() {
    this.isPlaying = false;
    this.currentDelta = 0;
    if (this.currentTicker) {
      Ticker.shared.remove(this.currentTicker);
      this.currentTicker = undefined;
    }
  }
  fixChairAncherIfExist(ancher: Vec2) {
    const chairNode = this.parent?.parent?.parent as Chair;
    if (chairNode?.type === 'chair') {
      chairNode.updatePartAncher(ancher);
    }
  }
  getOrCreatEffectLayer(zIndex: string | number, zmap?: Zmap) {
    const index =
      typeof zIndex === 'string' ? zmap?.indexOf(zIndex) || -1 : zIndex;
    let container = this.tamingMobLayers.get(index);
    if (!container) {
      container = new Container();
      container.zIndex = index;
      this.addChild(container);
      this.tamingMobLayers.set(index, container);
    }
    return container;
  }
  destroy() {
    this.stop();
    super.destroy();
    this.actionItem.clear();
    this.tamingMobLayers.clear();
  }
}
