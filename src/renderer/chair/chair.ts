import { Assets, Container, EventEmitter, type UnresolvedAsset } from 'pixi.js';

import { CharacterLoader } from '../character/loader';

import type {
  WzChairData,
  WzChairEffectSets,
  WzChairEffectItem,
} from './const/wz';
import type { CharacterData } from '@/store/character/store';
import type { PieceZ, Vec2 } from '../character/const/data';
import type { Character } from '../character/character';
import { TamingMob } from '../tamingMob/tamingMob';
import { ChairEffectItem } from './chairEffectItem';
import { generateChairGroupData, type ChairGroupData } from './chairGroupUtil';
import { CharacterAction } from '@/const/actions';
import { nextTick } from '@/utils/eventLoop';

const effectReg = /effect[0-9]?/; // effect, effect1, ...

export function getChairPath(id: number, isCash: boolean, parentPath: string) {
  const padId = id.toString().padStart(8, '0');
  const prefixPath = isCash ? 'Cash' : 'Install';
  return `Item/${prefixPath}/${parentPath}${padId}`;
}

export function getChairIconPath(
  id: number,
  isCash: boolean,
  parentPath: string,
) {
  const folder = getChairPath(id, isCash, parentPath);
  return `${folder}/info/icon`;
}

export class Chair extends Container {
  /* identity */
  type = 'chair';

  id: number;
  parentPath: string;
  isCash = false;
  wz?: WzChairData;
  items: ChairEffectItem[] = [];
  maxFrame = 0;
  chairFrame: Container;
  chairLayers = new Map<number, Container>();
  characters: [Character, CharacterData][] = [];
  tamingMobs: (TamingMob | undefined)[] = [];
  offsets: Vec2[] = [];
  groupData: ChairGroupData[] = [];

  isPlaying = false;
  hasPos1 = false;

  isLoading = false;
  loadFlashTimer = 0;
  loadEvent = new EventEmitter<'loading' | 'loaded' | 'error'>();

  constructor(id: number, parentPath: string) {
    super();
    this.id = id;
    // cash chair should be id 5204xxx
    this.isCash = id >= 5204000;
    this.parentPath = parentPath !== '' ? `${parentPath}/` : parentPath;
    this.chairFrame = new Container();
    this.chairFrame.sortableChildren = true;
    this.addChild(this.chairFrame);
  }
  get forceAction() {
    return this.wz?.info?.sitAction;
  }
  get forceExpression() {
    return this.wz?.info?.sitEmotion;
  }
  get tamingMobId() {
    return this.wz?.info?.tamingMob;
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
    const hide3 = !!this.wz?.info?.removeEffectBodyParts;
    return hide1 || hide2 || hide3;
  }
  get isHideBody() {
    return !!this.wz?.info?.removeBody;
  }
  get chairPath() {
    const padId = this.id.toString().padStart(8, '0');
    const prefixPath = this.isCash ? 'Cash' : 'Install';
    return `Item/${prefixPath}/${this.parentPath}${padId}`;
  }
  get nonCharacterLayers() {
    return Array.from(this.chairLayers.entries())
      .filter(([z]) => z !== 0)
      .map(([_, v]) => v);
  }

  async load() {
    // a chair should only load once though, but just in case
    if (this.isLoading) {
      clearTimeout(this.loadFlashTimer);
      this.loadEvent.emit('loading');
    }
    this.isLoading = true;
    // only show loading after 100ms
    this.loadFlashTimer = setTimeout(() => {
      if (this.isLoading) {
        this.loadEvent.emit('loading');
      }
    }, 50);

    if (!this.wz) {
      const data = await CharacterLoader.getPieceWzByPath<WzChairData>(
        this.chairPath,
      );
      if (data) {
        this.wz = data;
      }
    }

    if (!this.wz) {
      return;
    }

    this.items = this.createItems(this.wz);
    this.groupData = generateChairGroupData(this.wz);
    this.tamingMobs = this.createTamingMobs();
    await this.loadResource();
    await Promise.all(this.tamingMobs.map((mob) => mob?.load()));
    this.isLoading = false;
    this.loadEvent.emit('loaded');
  }
  async loadResourceByFrame(_: number) {
    // unimplemented
  }
  async loadResource() {
    const assets = this.items
      .flatMap((item) => item.frames)
      .flatMap((part) => part.resources)
      .filter(Boolean) as UnresolvedAsset[];
    await Assets.load(assets);
    for (const item of this.items) {
      item.prepareResource();
      const animatablePart = item.animatablePart;
      if (!animatablePart) {
        continue;
      }
      const effectIndex = animatablePart.effectZindex || -1;
      const container = this.getOrCreatEffectLayer(
        effectIndex > -1 ? effectIndex + 1 : effectIndex,
      );

      container.addChild(animatablePart);
    }
  }
  createItems(wz: WzChairData) {
    let root: WzChairEffectSets = wz;
    // if something looks like a id, use it as root
    const idKey = Object.keys(wz).find((key) => !Number.isNaN(Number(key)));
    if (idKey) {
      root = wz[idKey];
    }

    const items: ChairEffectItem[] = [];

    for (const key in wz) {
      if (effectReg.test(key)) {
        const effectData = root[
          key as keyof WzChairEffectSets
        ] as WzChairEffectItem;
        if (!effectData) {
          continue;
        }
        if (effectData.pos === 1) {
          this.hasPos1 = true;
        }
        const item = new ChairEffectItem(key, effectData, this);
        if (item.frameCount <= 0) {
          continue;
        }
        this.maxFrame = Math.max(this.maxFrame, item.frameCount);
        items.push(item);
      }
    }
    if (wz.info?.customChair?.androidChairInfo?.customEffect) {
      const item = new ChairEffectItem(
        'customEffect',
        wz.info.customChair.androidChairInfo.customEffect,
        this,
      );
      items.push(item);
    }

    return items;
  }
  createTamingMobs() {
    const tamingMobs: (TamingMob | undefined)[] = [];

    for (const groupData of this.groupData) {
      if (groupData.tamingMobId) {
        const tamingMob = new TamingMob(groupData.tamingMobId);
        tamingMobs.push(tamingMob);
      } else {
        tamingMobs.push(undefined);
      }
    }

    return tamingMobs;
  }

  /**
   * @usage 
    ```ts
    await chair.load();
    await chair.sitCharacter([
      [ch, data],
      [ch1, data],
    ]);
    ```
  */
  async sitCharacter(characters: [Character, CharacterData][]) {
    if (this.destroyed) {
      return;
    }

    if (this.characters.length > 0) {
      for (const character of this.characters) {
        character[0].removeFromParent();
      }
    }

    this.characters = characters;

    const container = this.getOrCreatEffectLayer(0);

    let index = 0;

    for await (const [character, data] of characters) {
      const gd = this.groupData[index];
      if (!gd) {
        continue;
      }

      const hasTaming = !!gd.tamingMobId;
      const characterData = {
        ...data,
        // if chair has tamingMob, force set to sit, prevent TamingMob can't use right action
        action: gd.tamingMobId ? CharacterAction.Sit : gd.action,
        expression: gd.expression || data.expression,
        showNameTag: index === 0 ? data.showNameTag : false,
        isAnimating: hasTaming ? false : characters[0][1].isAnimating,
      };
      if (hasTaming) {
        await this.tamingMobs[index]?.sitCharacter([
          [character, characterData],
        ]);
      }
      const offset = { ...gd.position };
      // this still need to be tested
      // example: [3015895, '030158.img'], [3015818, '030158.img'], [03018696, '03018.img']
      if (gd.hideBody) {
        character.isHideBody = true;
        offset.y -= 30;
      } else {
        character.isHideBody = false;
      }
      character.bodyContainer.position.set(offset.x, offset.y);

      await character.update({
        ...data,
        // if chair has tamingMob, force set to sit, prevent TamingMob can't use right action
        action: gd.tamingMobId ? CharacterAction.Sit : gd.action,
        expression: gd.expression || data.expression,
        showNameTag: index === 0 ? data.showNameTag : false,
        isAnimating: hasTaming ? false : characters[0][1].isAnimating,
      });
      character.updateFlip(gd.flip);
      if (this.isHideEffect) {
        character.toggleEffectVisibility(true);
      }
      const tamingMob = this.tamingMobs[index];
      if (hasTaming && tamingMob) {
        container.addChild(tamingMob);
      } else {
        container.addChild(character);
      }
      index += 1;
    }
    // sync the character frame so they all start at the same time
    for (const [character, _] of characters) {
      character.currentDelta = 0;
      character.instructionFrame = 0;
    }
    for (const tam of this.tamingMobs) {
      if (!tam) {
        continue;
      }
      tam.currentDelta = 0;
      tam.instructionFrame = 0;
      tam.playByInstructions();
    }

    await nextTick();
  }

  updatePartAncher(ancher: Vec2) {
    if (!this.hasPos1) {
      return;
    }
    for (const layer of this.nonCharacterLayers) {
      layer.pivot.set(-ancher.x, -ancher.y);
    }
  }

  getOrCreatEffectLayer(zIndex: number) {
    let container = this.chairLayers.get(zIndex);
    if (!container) {
      container = new Container();
      container.zIndex = zIndex >= 1 ? zIndex + 200 : zIndex - 10;
      this.chairFrame.addChild(container);
      this.chairLayers.set(zIndex, container);
    }
    return container;
  }

  play() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    for (const item of this.items) {
      item.animatablePart?.play();
    }
  }
  destroy() {
    super.destroy();
    this.loadEvent.removeAllListeners();
    this.tamingMobs.forEach((tam, index) => {
      tam?.removeChildren();
      tam?.destroy();
      const indexCharacter = this.characters[index];
      if (indexCharacter) {
        indexCharacter[0].customInstructions = [];
      }
    });
    clearTimeout(this.loadFlashTimer);
  }
}
