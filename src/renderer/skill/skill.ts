import { Assets, type UnresolvedAsset } from 'pixi.js';

import { CharacterLoader } from '../character/loader';
import type { Character } from '../character/character';

import type {
  WzSkillData,
  WzSkillPngSet,
  WzSkillPngSets,
  WzPngPieceInfo,
} from './const/wz';
import { SkillItem } from './skillItem';
import type { SkillAnimatablePart } from './skillAnimatablePart';

import { CharacterAction, isValidAction } from '@/const/actions';

export function getSkillParentPath(id: string) {
  const preifx = id.slice(0, -4);
  return `${preifx}.img`;
}

const SkillEffectKeyReg = /^(effect|screen|keydown|special)[0-9]?$/;
const SkillPrefixReg = /^(effect|screen|keydown|special)/;
const EffectKeys = ['effect', 'screen', 'keydown', 'special'];

export class Skill {
  destroyed = false;
  items = new Map<string, SkillItem[]>();
  id: string;
  parentPath: string;
  wz?: WzSkillData | null;
  action: string | CharacterAction = CharacterAction.Alert;
  backLayers: SkillAnimatablePart[] = [];
  frontLayers: SkillAnimatablePart[] = [];
  character?: Character;
  randomEffectName = '';
  randomIndex = -1;
  defaultSpeed = 1;
  notRandomMap = new Set<string>();
  #_visible = false;
  constructor(id: string, defaultSpeed = 1) {
    this.id = id;
    this.parentPath = getSkillParentPath(id);
    this.defaultSpeed = defaultSpeed;
  }
  get skillPath() {
    return `Skill/${this.parentPath}/skill/${this.id}`;
  }
  get randomItems() {
    return Array.from(this.items.entries()).filter(([k, _]) => {
      const prefix = k.match(SkillPrefixReg)?.[0] || k;
      const notRandom = this.notRandomMap.has(prefix);
      if (notRandom) {
        return true;
      }

      const randomName = `${prefix}${this.randomIndex === 1 ? '' : this.randomIndex}`;
      return k === randomName;
    });
  }
  get allItems() {
    return Array.from(this.items.entries());
  }
  get currentItems() {
    return (this.randomIndex !== -1 ? this.randomItems : this.allItems).flatMap(
      ([_, items]) => items,
    );
  }
  get isNormalAction() {
    return isValidAction(this.action as CharacterAction);
  }
  get isJumpingAction() {
    return this.wz?.info?.avaliableInJumpingState === 1;
  }
  get isPlaying() {
    return (
      this.backLayers.some((layer) => layer.playing) ||
      this.frontLayers.some((layer) => layer.playing)
    );
  }
  set speed(speed: number) {
    const items = this.currentItems;
    for (const item of items) {
      if (item.animatablePart) {
        item.animatablePart.animationSpeed = speed;
      }
    }
  }
  get visible() {
    return this.#_visible;
  }
  set visible(value: boolean) {
    this.#_visible = value;
    for (const layer of this.backLayers) {
      layer.visible = value;
    }
    for (const layer of this.frontLayers) {
      layer.visible = value;
    }
  }
  async load() {
    if (this.wz) {
      return;
    }
    this.wz = await CharacterLoader.getPieceWzByPath<WzSkillData>(
      this.skillPath,
    );
    if (!this.wz) {
      return;
    }
    this.createItems(this.wz);
    if (this.wz.action?.[0]) {
      this.action = this.wz.action[0];
    }
    if (this.isJumpingAction && !this.wz.action?.[0]) {
      this.action = CharacterAction.Jump;
    }
    if (this.wz.randomEffect !== undefined) {
      this.setRandomEffectName();
    }
    await this.loadResource();
  }
  async loadResource() {
    const items = this.currentItems;
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
      animatablePart.animationSpeed = this.defaultSpeed;
      const zIndex = animatablePart.zIndex;
      if (zIndex < 0) {
        this.backLayers.push(animatablePart);
      } else {
        this.frontLayers.push(animatablePart);
      }
    }
  }
  play() {
    if (!this.character || this.destroyed) {
      return;
    }
    for (const layer of this.backLayers) {
      this.character.backSkillContainer.addChild(layer);
    }
    for (const layer of this.frontLayers) {
      this.character.frontSkillContainer.addChild(layer);
    }
    for (const layer of this.backLayers) {
      layer.visible = true;
      layer.gotoAndPlay(0);
    }
    for (const layer of this.frontLayers) {
      layer.visible = true;
      layer.gotoAndPlay(0);
    }
  }
  createItems(wz: WzSkillData) {
    const typeCountMap = new Map<string, number>();
    for (const key in wz) {
      const items: SkillItem[] = [];
      const data = wz[key as keyof WzSkillData];
      if (!(SkillEffectKeyReg.test(key) && data)) {
        continue;
      }
      const firstNumberKey = Object.keys(data).find((k) =>
        Number.isInteger(Number(k)),
      ) as unknown as keyof WzSkillPngSet;
      if (!firstNumberKey) {
        continue;
      }
      if ((data as WzSkillPngSet)[firstNumberKey].width !== undefined) {
        items.push(new SkillItem(key, data as WzSkillPngSet, this, '0'));
      } else {
        items.push(...this.createFieldItems(key, data as WzSkillPngSets));
      }
      const prefix = key.match(SkillPrefixReg)?.[0] || key;
      if (prefix) {
        const count = typeCountMap.get(prefix) || 0;
        typeCountMap.set(prefix, count + 1);
      }
      this.items.set(key, items);
    }
    const randomCount = this.wz?.randomEffect || 0;
    if (randomCount === 0) {
      return;
    }
    for (const key of EffectKeys) {
      if (typeCountMap.get(key) !== randomCount) {
        this.notRandomMap.add(key);
      }
    }
  }
  createFieldItems(field: string, wz: WzSkillPngSets) {
    const items: SkillItem[] = [];

    for (const key in wz) {
      const data = wz[key];
      if (Number.isNaN(Number(key)) || !data) {
        continue;
      }
      if ((data[0] as WzPngPieceInfo)?.width !== undefined) {
        items.push(new SkillItem(field, data, this, key));
      }
    }
    return items;
  }
  setRandomEffectName() {
    const randomCount = this.wz?.randomEffect || 0;
    if (randomCount === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * randomCount) + 1;
    this.randomIndex = randomIndex;
  }
  getTimelines(): number[][] {
    return this.currentItems
      .map((item) => item.animatablePart?.timeline)
      .filter(Boolean) as number[][];
  }
  resetDelta() {
    for (const item of this.currentItems) {
      if (item.animatablePart) {
        item.animatablePart.currentFrame = 0;
        /* @ts-ignore */
        item.animatablePart._currentTime = 0;
        /* @ts-ignore */
        item.animatablePart._updateFrame();
      }
    }
  }

  destroy() {
    this.destroyed = true;
    this.character = undefined;
    this.backLayers = [];
    this.frontLayers = [];
    for (const items of this.items.values()) {
      for (const item of items) {
        item.destroy();
      }
    }
    this.items.clear();
  }
}
