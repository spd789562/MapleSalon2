import { Assets, Container, EventEmitter, type UnresolvedAsset } from 'pixi.js';

import { CharacterLoader } from '../character/loader';

import type {
  WzChairData,
  WzChairEffectSets,
  WzChairEffectItem,
  WzChairEffectData,
  WzPngPieceInfo,
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
  effectWz?: WzChairEffectData;
  items: ChairEffectItem[] = [];
  variantItems: Map<number, ChairEffectItem[]> = new Map();
  variant?: number;
  maxFrame = 0;
  chairFrame: Container;
  chairLayers = new Map<number, Container>();
  characters: [Character, CharacterData][] = [];
  characterContainer: Container[] = [];
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
  get characterScale() {
    return (this.wz?.info?.customChair?.scaleAvatar?.scale || 100) / 100;
  }
  get currentItems() {
    const variantItems = this.variant && this.variantItems.get(this.variant);
    return variantItems || this.items;
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

    await this.loadChairWz();
    if (!this.wz) {
      return;
    }
    await this.loadEffectWz();
    const items = this.createItems(this.wz);
    this.createVariants(this.wz);
    const effectItems = this.effectWz
      ? this.createEffectItems(this.effectWz)
      : [];
    this.items = [...items, ...effectItems];
    this.groupData = generateChairGroupData(this.wz);
    this.tamingMobs = this.createTamingMobs();
    if (this.variantItems.size > 0) {
      const count = this.variantItems.size + 1;
      const random = Math.floor(Math.random() * count) + 1;
      this.variant = random;
      await this.loadVariantResource(random);
    } else {
      await this.loadResource(this.items);
    }
    await Promise.all(this.tamingMobs.map((mob) => mob?.load()));
    this.isLoading = false;
    this.loadEvent.emit('loaded');
  }
  async loadChairWz() {
    if (this.wz) {
      return;
    }
    const data = await CharacterLoader.getPieceWzByPath<WzChairData>(
      this.chairPath,
    );
    if (data) {
      this.wz = data;
    }
  }
  async loadEffectWz() {
    if (this.effectWz) {
      return;
    }
    const data = await CharacterLoader.getPieceEffectWz<WzChairEffectData>(
      this.id,
      false,
    );
    if (data) {
      this.effectWz = data;
    }
  }
  async loadResourceByFrame(_: number) {
    // unimplemented
  }
  loadVariantResource(variant: number) {
    const variantItems = this.variantItems.get(variant);
    if (!variantItems || variant === 0) {
      return this.loadResource(this.items);
    }
    return this.loadResource(variantItems);
  }
  async loadResource(items: ChairEffectItem[]) {
    const assets = items
      .flatMap((item) => item.frames)
      .flatMap((part) => part.resources)
      .filter(Boolean) as UnresolvedAsset[];
    await Assets.load(assets);
    for (const item of items) {
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
        const item = new ChairEffectItem(
          key,
          effectData,
          this,
          wz.info.bodyRelMove,
        );
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
        wz.info.bodyRelMove,
      );
      items.push(item);
    }

    return items;
  }
  createEffectItems(effectWz: WzChairEffectData) {
    const items: ChairEffectItem[] = [];
    for (const key in effectWz) {
      if (Number.isNaN(Number(key)) || !effectWz[key]) {
        continue;
      }
      const effectData = effectWz[key];
      if ((effectData[1] as WzPngPieceInfo)?.origin) {
        items.push(
          new ChairEffectItem(
            key,
            effectData as WzChairEffectItem,
            this,
            this.wz?.info.bodyRelMove,
          ),
        );
        continue;
      }
      const effectDatas = effectData as Record<number, WzChairEffectItem>;
      for (const key2 in effectDatas) {
        if (
          (effectDatas[key2] as unknown as WzPngPieceInfo)?.origin ||
          !effectDatas[key2][0]
        ) {
          continue;
        }
        items.push(
          new ChairEffectItem(
            key2,
            effectDatas[key2],
            this,
            this.wz?.info.bodyRelMove,
          ),
        );
      }
    }
    return items;
  }
  createVariants(wz: WzChairData) {
    const randomEffectData = wz.info.randEffect;
    if (!randomEffectData) {
      return;
    }
    const randomEffectCount = Object.keys(randomEffectData).length;
    for (let i = 1; i < randomEffectCount; i++) {
      const key = `randEffect${i}`;
      const effectSetData = wz[key];
      if (!effectSetData) {
        continue;
      }
      const items = [] as ChairEffectItem[];
      for (const k in effectSetData) {
        if (effectReg.test(k)) {
          const effectData = effectSetData[k as keyof WzChairEffectSets];
          if (!effectData) {
            continue;
          }
          const item = new ChairEffectItem(
            k,
            effectData,
            this,
            randomEffectData[i]?.bodyRelMove || wz.info.bodyRelMove,
          );
          if (item.frameCount <= 0) {
            continue;
          }
          items.push(item);
        }
      }
      this.variantItems.set(i, items);
    }
  }
  createTamingMobs() {
    const tamingMobs: (TamingMob | undefined)[] = [];

    for (const groupData of this.groupData) {
      if (groupData.tamingMobId) {
        const tamingMob = new TamingMob(groupData.tamingMobId);
        if (groupData.action) {
          tamingMob.sitAction = groupData.action;
        }
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
      let characterContainer = this.characterContainer[index];

      if (!characterContainer) {
        characterContainer = new Container();
        container.addChild(characterContainer);
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
      character.forceScale = this.characterScale;
      if (character.forceScale !== 1 && gd.hideBody) {
        offset.y -= 30 * (character.forceScale - 1);
        offset.x -= 6 * (character.forceScale - 1);
      }
      characterContainer.position.set(offset.x, offset.y);

      await character.update({
        ...data,
        // if chair has tamingMob, force set to sit, prevent TamingMob can't use right action
        action: gd.tamingMobId ? CharacterAction.Sit : gd.action,
        expression: gd.expression || data.expression,
        showNameTag: index === 0 ? data.showNameTag : false,
        isAnimating: characters[0][1].isAnimating,
      });
      await character.loadItems();
      if (gd.flip === true) {
        character.fixedFlip = 'right';
      } else if (gd.flip === false) {
        character.fixedFlip = 'left';
      } else {
        character.fixedFlip = undefined;
      }
      const tamingMob = this.tamingMobs[index];
      if (hasTaming && tamingMob) {
        characterContainer.addChild(tamingMob);
      } else {
        characterContainer.addChild(character);
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
  async changeVariant(variant: number) {
    if (this.variant === variant) {
      return;
    }
    for (const item of this.currentItems) {
      item.animatablePart?.stop();
      item.animatablePart?.removeFromParent();
    }
    this.variant = variant;
    await this.loadVariantResource(variant);
  }

  updatePartAncher(ancher: Vec2) {
    for (const item of this.currentItems) {
      item.updateAncher(ancher);
    }
  }

  getOrCreatEffectLayer(zIndex: number) {
    let container = this.chairLayers.get(zIndex);
    if (!container) {
      container = new Container();
      container.zIndex = zIndex >= 1 ? zIndex + 200 : zIndex - 10;
      this.chairFrame.addChild(container);
      this.chairLayers.set(zIndex, container);
      if (zIndex === 0) {
        container.sortableChildren = true;
      }
    }
    return container;
  }

  play() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    for (const item of this.currentItems) {
      item.animatablePart?.play();
    }
  }
  resetDelta() {
    for (const item of this.currentItems) {
      if (item.animatablePart) {
        item.animatablePart.currentFrame = 0;
        /* @ts-ignore */
        item.animatablePart._currentTime = 0;
      }
    }
    let index = 0;
    for (const [character, _] of this.characters) {
      const gd = this.groupData[index];
      if (!gd) {
        continue;
      }
      if (gd.tamingMobId) {
        this.tamingMobs[index]?.resetDelta();
      } else {
        character.resetDelta();
        character.playBodyFrame();
      }
      index += 1;
    }
  }

  getTimelines(): number[][] {
    const timelines = [] as number[][];

    for (const item of this.currentItems) {
      const timeline = item.timeline;
      if (timeline.length > 1) {
        timelines.push(item.timeline);
      }
    }

    let index = 0;
    for (const _ of this.characters) {
      const gd = this.groupData[index];
      if (!gd?.tamingMobId) {
        continue;
      }
      if (this.tamingMobs[index]) {
        const timeline = this.tamingMobs[index]?.actionItem.get(
          CharacterAction.Sit,
        )?.timeline;
        if (timeline && timeline.length > 1) {
          timelines.push(timeline);
        }
      }
      index += 1;
    }

    return timelines;
  }
  destroy() {
    super.destroy();
    this.loadEvent.removeAllListeners();
    this.tamingMobs.forEach((tam, index) => {
      tam?.destroy();
      tam?.removeChildren();
      const indexCharacter = this.characters[index];
      if (indexCharacter) {
        indexCharacter[0].customInstructions = [];
      }
    });
    clearTimeout(this.loadFlashTimer);
  }
}
