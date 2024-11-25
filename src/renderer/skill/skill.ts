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
  constructor(id: string) {
    this.id = id;
    this.parentPath = getSkillParentPath(id);
  }
  get skillPath() {
    return `Skill/${this.parentPath}/skill/${this.id}`;
  }
  get currentItems() {
    return Array.from(this.items.entries())
      .filter(([k, _]) =>
        this.randomEffectName
          ? k.startsWith('effect') && k === this.randomEffectName
          : true,
      )
      .flatMap(([_k, v]) => v);
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
    if (this.isJumpingAction) {
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
    for (const key in wz) {
      const items: SkillItem[] = [];
      const data = wz[key as keyof WzSkillData];
      if (!(SkillEffectKeyReg.test(key) && data)) {
        continue;
      }
      const firstNumberKey = Object.keys(data).find((k) =>
        Number.isInteger(Number(k)),
      ) as unknown as keyof WzSkillPngSet;
      if ((data as WzSkillPngSet)[firstNumberKey].width !== undefined) {
        items.push(new SkillItem(key, data as WzSkillPngSet, this));
      } else {
        items.push(...this.createFieldItems(key, data as WzSkillPngSets));
      }
      this.items.set(key, items);
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
        items.push(new SkillItem(field, data, this));
      }
    }
    return items;
  }
  setRandomEffectName() {
    const effectKeys = Array.from(this.items.keys()).filter((key) =>
      key.startsWith('effect'),
    );
    if (effectKeys.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * effectKeys.length);
    this.randomEffectName = effectKeys[randomIndex];
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
    for (const items of this.items.values()) {
      for (const item of items) {
        item.destroy();
      }
    }
  }
}
