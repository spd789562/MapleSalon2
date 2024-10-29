import { Assets, Container, type UnresolvedAsset } from 'pixi.js';

import { CharacterLoader } from '../character/loader';

import type {
  WzChairData,
  WzChairEffectSets,
  WzChairEffectItem,
} from './const/wz';
import type { PieceZ, Vec2 } from '../character/const/data';
import type { Character } from '../character/character';
import type { CharacterData } from '@/store/character/store';
import { ChairEffectItem } from './chairEffectItem';
import { generateChairGroupData, type ChairGroupData } from './chairGroupUtil';
import { CharacterAction } from '@/const/actions';

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
  id: number;
  parentPath: string;
  isCash = false;
  wz?: WzChairData;
  items: ChairEffectItem[] = [];
  maxFrame = 0;
  chairFrame: Container;
  chairLayers = new Map<number, Container>();
  characters: [Character, CharacterData][] = [];
  offsets: Vec2[] = [];
  groupData: ChairGroupData[] = [];

  isPlaying = false;

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
  async load() {
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
        const item = new ChairEffectItem(key, effectData, this);
        this.maxFrame = Math.max(this.maxFrame, item.frameCount);
        items.push(item);
      }
    }
    if (this.wz.info?.customChair?.androidChairInfo?.customEffect) {
      const item = new ChairEffectItem(
        'customEffect',
        this.wz.info.customChair.androidChairInfo.customEffect,
        this,
      );
      items.push(item);
    }

    this.items = items;

    this.groupData = generateChairGroupData(this.wz);
    await this.loadResource();
  }
  async loadResourceByFrame(index: number) {
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
      const container = this.getOrCreatEffectLayer(
        animatablePart.effectZindex || -1,
      );

      container.addChild(animatablePart);
    }
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

      container.addChild(character);
      if (gd.tamingMobId) {
        character.tamingMobId = gd.tamingMobId;
      }
      const offset = { ...gd.position };
      // this still need to be tested
      // example: [3015895, '030158.img'], [3015818, '030158.img'], [03018696, '03018.img']
      if (gd.hideBody) {
        character.isHideBody = true;
        offset.y -= 30;
      }
      character.offset = {
        x: offset.x,
        y: offset.y,
      };

      await character.update({
        ...data,
        action: gd.action || CharacterAction.Sit,
        expression: gd.expression || data.expression,
        showNameTag: index === 0 ? data.showNameTag : false,
        // isAnimating: false,
      });
      character.bodyFrame.scale.x = gd.flip ? -1 : 1;
      if (this.isHideEffect) {
        character.toggleEffectVisibility(true);
      }

      index += 1;
    }
  }

  getOrCreatEffectLayer(zIndex: number) {
    let container = this.chairLayers.get(zIndex);
    if (!container) {
      container = new Container();
      container.zIndex = zIndex >= 2 ? zIndex + 200 : zIndex - 10;
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

  // not sure is a good idea to bind this on character
  playFrameOnCharacter(character: Character) {
    const zmap = CharacterLoader?.zmap;
    if (!zmap) {
      return;
    }
    for (const item of this.items) {
      const part = item.animatablePart;
      if (!part) {
        continue;
      }
      const z = part.effectZindex || 1;
      let container: Container;
      if (typeof z === 'string') {
        container = character.getOrCreatZmapLayer(zmap, z as PieceZ);
      } else {
        container = character.getOrCreatEffectLayer(z);
      }
      container.addChild(part);

      part.play();
    }
  }
}
