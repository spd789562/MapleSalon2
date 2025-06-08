import type { Filter } from 'pixi.js';
import { CharacterLoader } from './loader';

import type { Character } from './character';
import type {
  ItemInfo,
  RenderItemInfo,
  PieceIslot,
  PieceVslot,
  AncherName,
  Vec2,
  ItemDyeInfo,
} from './const/data';
import type {
  WzItem,
  WzEffectItem,
  WzPieceFrame,
  WzEffectActionItem,
} from './const/wz';

import {
  isFaceId,
  isWeaponId,
  isCashWeaponId,
  isHairId,
  isFaceAccessoryId,
  isHeadId,
  isBodyId,
  isCapId,
  isShoesId,
} from '@/utils/itemId';
import {
  gatFaceAvailableColorIds,
  gatHairAvailableColorIds,
  getFaceColorId,
  getHairColorId,
} from '@/utils/mixDye';

import { HsvAdjustmentFilter } from '@/renderer/filter/hsvAdjustmentFilter';
import { CharacterActionItem, CharacterFaceItem } from './categorizedItem';
import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterHandType } from '@/const/hand';

const BaseWeaponId = 30;
const GunWeaponId = 49;

export class CharacterItem implements RenderItemInfo {
  info: ItemInfo;
  islot: PieceIslot[];
  vslot: PieceVslot[];

  actionPieces: Map<
    CharacterAction | CharacterExpressions,
    CharacterActionItem | CharacterFaceItem
  >;
  effectPieces: Map<CharacterAction | 'default', CharacterActionItem>;
  setEffectPieces: Map<CharacterAction | 'default', CharacterActionItem>;

  character: Character;

  // sience wz will be parsed when loaded, it's might be not needed to store them
  wz: WzItem | null = null;
  effectWz: WzEffectItem | null = null;
  setEffectWz: WzEffectItem | null = null;
  isCleanedWz = false;
  isOverrideFace = false;

  filters: (HsvAdjustmentFilter | Filter)[] = [];

  avaliableDye = new Map<ItemDyeInfo['color'], number>();

  constructor(info: ItemInfo, character: Character) {
    this.info = info;
    this.actionPieces = new Map();
    this.effectPieces = new Map();
    this.setEffectPieces = new Map();
    this.islot = [];
    this.vslot = [];

    this.character = character;
    this.updateFilter();
  }

  get isFace() {
    return isFaceId(this.info.id);
  }

  get isFaceAccessory() {
    return isFaceAccessoryId(this.info.id);
  }

  get isUseExpressionItem() {
    return this.isFace || this.isFaceAccessory;
  }

  get isHair() {
    return isHairId(this.info.id);
  }

  get isHead() {
    return isHeadId(this.info.id);
  }

  get isBody() {
    return isBodyId(this.info.id);
  }

  get isCap() {
    return isCapId(this.info.id);
  }

  get isWeapon() {
    return isWeaponId(this.info.id) || isCashWeaponId(this.info.id);
  }

  isAncherAncherBuiltByFrame(
    action: CharacterAction | CharacterExpressions,
    frame: number,
  ) {
    const actionItem = this.actionPieces.get(action);
    if (!actionItem) {
      return true;
    }
    return actionItem.isAllAncherBuiltByFrame(frame);
  }

  private loadFace(wz: WzItem) {
    const expressionNeedToBuild = Object.values(CharacterExpressions);
    const expressions = Object.keys(wz).filter((key) =>
      expressionNeedToBuild.includes(key as CharacterExpressions),
    ) as CharacterExpressions[];
    for (const expression of expressions) {
      const expressionWz = wz[expression];

      if (!expressionWz) {
        continue;
      }
      const actionItem = new CharacterFaceItem(expression, expressionWz, this);

      this.actionPieces.set(expression, actionItem);
    }
    // fix some face not have default frame
    if (
      !wz[CharacterExpressions.Default] &&
      wz[CharacterExpressions.Blink]?.[0]
    ) {
      const { delay, ...blinkFrameOne } = wz[CharacterExpressions.Blink][0];

      const actionItem = new CharacterFaceItem(
        CharacterExpressions.Default,
        blinkFrameOne as unknown as Record<number, WzPieceFrame>,
        this,
      );

      this.actionPieces.set(CharacterExpressions.Default, actionItem);
    }
    if (!this.isCleanedWz) {
      for (const key of Object.keys(wz)) {
        if (
          !expressions.includes(key as CharacterExpressions) &&
          key !== 'info'
        ) {
          delete wz[key];
        }
      }
      this.isCleanedWz = true;
    }
  }
  private loadAction(wz: WzItem, force = false) {
    const actionNeedToBuild = Object.values(CharacterAction);
    const actions = Object.keys(wz).filter((key) =>
      actionNeedToBuild.includes(key as CharacterAction),
    ) as CharacterAction[];

    for (const action of actions) {
      const actionWz = wz[action];

      if (!actionWz || (this.actionPieces.has(action) && !force)) {
        continue;
      }

      const actionItem = new CharacterActionItem(action, actionWz, this);

      this.actionPieces.set(action, actionItem);
    }

    if (!this.isCleanedWz) {
      for (const key of Object.keys(wz)) {
        if (!actions.includes(key as CharacterAction) && key !== 'info') {
          delete wz[key];
        }
      }
      this.isCleanedWz = true;
    }
  }
  private loadEffect(wz: WzEffectItem) {
    const actionNeedToBuild = (
      Object.values(CharacterAction) as (CharacterAction | 'default')[]
    ).concat('default');

    for (const action of actionNeedToBuild) {
      const effectWz = wz[action];
      if (!effectWz || this.effectPieces.has(action)) {
        continue;
      }

      if (effectWz.z === undefined) {
        effectWz.z = wz.z || -1;
      }

      const actionItem = new CharacterActionItem(
        action === 'default' ? CharacterAction.Walk1 : action,
        {},
        this,
        effectWz,
      );

      this.effectPieces.set(action, actionItem);
    }
  }
  private loadSetEffect(wz: WzEffectItem) {
    const actionNeedToBuild = (
      Object.values(CharacterAction) as (CharacterAction | 'default')[]
    ).concat('default');

    for (const action of actionNeedToBuild) {
      const setEffectWz =
        wz[action] ||
        wz.default ||
        // the setEffect might not have any action/default folder of it
        (wz[0]
          ? (this.setEffectWz as unknown as WzEffectActionItem)
          : undefined);

      if (setEffectWz !== undefined && setEffectWz.z === undefined) {
        setEffectWz.z = this.setEffectWz?.z || -1;
      }

      if (!setEffectWz || this.setEffectPieces.has(action)) {
        continue;
      }

      if (setEffectWz.z === undefined) {
        setEffectWz.z = wz.z || -1;
      }

      const actionItem = new CharacterActionItem(
        action === 'default' ? CharacterAction.Walk1 : action,
        {},
        this,
        setEffectWz,
      );

      this.setEffectPieces.set(action, actionItem);
    }
  }
  private loadWeapon(wz: WzItem) {
    const isSingleHand =
      this.character.handType === CharacterHandType.SingleHand;
    const isGunHand = this.character.handType === CharacterHandType.Gun;
    const baseWz = wz[BaseWeaponId] as unknown as WzItem;
    const GunWz = wz[GunWeaponId] as unknown as WzItem;

    /* gun's use 49 code */
    if (isGunHand && GunWz?.[this.character.useAction]) {
      return this.loadAction(GunWz, true);
    }

    /* if has 30, just use 30 */
    if (baseWz?.[this.character.useAction]) {
      return this.loadAction(baseWz, true);
    }
    const idIncurrment = isSingleHand ? -1 : 1;
    const [start, end] = isSingleHand ? [69, 29] : [30, 70];

    /* single hand weapon usually has higher id */
    for (let id = start; id !== end; id += idIncurrment) {
      const weaponWz = wz[id] as unknown as WzItem;
      /* make sure the current weapon id has current action */
      if (weaponWz?.[this.character.useAction]) {
        this.loadAction(weaponWz as unknown as WzItem, true);
        return;
      }
    }
  }

  async load() {
    if (!this.wz) {
      this.wz = await CharacterLoader.getPieceWz(this.info.id);
      if (this.info.enableEffect) {
        this.effectWz = await CharacterLoader.getPieceEffectWz(this.info.id);
      }
      if (CharacterLoader.setMap.has(this.info.id.toString())) {
        this.setEffectWz = await CharacterLoader.getPieceSetEffectWz(
          this.info.id,
        );
      }
    }

    if (this.wz === null) {
      if (this.effectWz) {
        this.loadEffect(this.effectWz);
      }
      return;
    }

    /* some item will not have info, WTF? */
    this.islot = (this.wz?.info?.islot?.match(/.{1,2}/g) || []) as PieceIslot[];
    this.vslot = (this.wz?.info?.vslot?.match(/.{1,2}/g) || []) as PieceIslot[];
    this.isOverrideFace = this.wz?.info?.invisibleFace === 1;

    /* a shoe should alwasy be a shoe! pls */
    if (isShoesId(this.info.id) && !this.islot.includes('So')) {
      this.islot = ['So'];
    }

    /* resolve dye */
    if (this.isFace && this.avaliableDye.size === 0) {
      const ids = gatFaceAvailableColorIds(this.info.id);
      this.avaliableDye = new Map(ids.map((id) => [getFaceColorId(id), id]));
    } else if (this.isHair && this.avaliableDye.size === 0) {
      const ids = gatHairAvailableColorIds(this.info.id);
      this.avaliableDye = new Map(ids.map((id) => [getHairColorId(id), id]));
    }

    if (this.effectWz) {
      this.loadEffect(this.effectWz);
    }
    if (this.setEffectWz) {
      this.loadSetEffect(this.setEffectWz);
    }
    const baseKeys = Object.keys(this.wz);
    if (baseKeys.length === 1 && baseKeys[0] === 'info') {
      return;
    }

    if (this.isUseExpressionItem) {
      this.loadFace(this.wz);
      /* normal weapon not include extra int folder, will just tread like normal item */
    } else if (
      this.isWeapon &&
      !(CharacterAction.Alert in this.wz && CharacterAction.Jump in this.wz)
    ) {
      this.loadWeapon(this.wz);
    } else {
      this.loadAction(this.wz);
    }
  }

  async prepareActionAnimatableResource(name: CharacterAction) {
    const effectItem = this.getEffect(name);
    if (effectItem) {
      await effectItem.loadAnimatableResource();
      effectItem.prepareAnimatableResourece();
    }
    const setEffectItem = this.getSetEffect(name);
    if (setEffectItem) {
      await setEffectItem.loadAnimatableResource();
      setEffectItem.prepareAnimatableResourece();
    }
  }
  async prepareActionResource(name: CharacterAction | CharacterExpressions) {
    const actionItem = this.actionPieces.get(name);
    if (!actionItem) {
      return;
    }
    await actionItem.loadResource();
    actionItem.prepareResourece();
  }
  async prepareAllActionResource() {
    const loadActionItems = Array.from(this.actionPieces.values())
      .filter((item) => item.wz !== null && item.items.size === 0)
      .map(async (item) => {
        await item.loadResource();
        item.prepareResourece();
      });
    return Promise.all(loadActionItems);
  }
  async prepareActionResourceByFrame(
    name: CharacterAction | CharacterExpressions,
    frame: number,
  ) {
    const actionItem = this.actionPieces.get(name);

    if (actionItem) {
      await actionItem.loadResourceByFrame(frame);
      actionItem.prepareResoureceByFrame(frame);
    }
  }
  async prepareAnimatableResourceByFrame(name: CharacterAction, frame: number) {
    const effectItem = this.getEffect(name);
    if (effectItem) {
      await effectItem.loadResourceByFrame(frame);
      effectItem.prepareAnimatableResoureceByFrame(frame);
    }
    const setEffectItem = this.getSetEffect(name);
    if (setEffectItem) {
      await setEffectItem.loadResourceByFrame(frame);
      setEffectItem.prepareAnimatableResoureceByFrame(frame);
    }
  }

  tryBuildAncher(
    action: CharacterAction,
    currentAnchers: Map<AncherName, Vec2>[],
  ): Map<AncherName, Vec2>[] {
    let item: CharacterActionItem | CharacterFaceItem | undefined;
    if (this.isUseExpressionItem) {
      item = this.actionPieces.get(this.character.expression);
    } else {
      item = this.actionPieces.get(action);
    }
    if (!item) {
      return currentAnchers;
    }
    return item.tryBuildAncher(currentAnchers);
  }

  tryBuildAncherByFrame(
    action: CharacterAction | CharacterExpressions,
    currentAnchers: Map<AncherName, Vec2>,
    frame: number,
  ): Map<AncherName, Vec2> {
    const item: CharacterActionItem | CharacterFaceItem | undefined =
      this.actionPieces.get(action);
    if (!item) {
      return currentAnchers;
    }
    return item.tryBuildAncherByFrame(currentAnchers, frame);
  }
  resetAncherByFrame(
    action: CharacterAction | CharacterExpressions,
    frame: number,
  ) {
    const item: CharacterActionItem | CharacterFaceItem | undefined =
      this.actionPieces.get(action);
    item?.resetAncherByFrame(frame);
  }

  updateFilter() {
    const hasAnyDye =
      this.info.hue !== undefined ||
      this.info.saturation !== undefined ||
      this.info.brightness !== undefined ||
      this.info.alpha !== undefined;

    if (!hasAnyDye) {
      if (this.filters.length > 0) {
        (this.filters[0] as HsvAdjustmentFilter).enabled = false;
      }
      return;
    }

    if (this.filters.length === 0) {
      this.filters.push(new HsvAdjustmentFilter());
      this.applyFilter();
    } else {
      (this.filters[0] as HsvAdjustmentFilter).enabled = true;
    }
    const hsvFilter = this.filters[0] as HsvAdjustmentFilter;

    if (this.info.colorRange !== undefined) {
      hsvFilter.colorRange = this.info.colorRange;
    } else if (hsvFilter.colorRange !== 0) {
      hsvFilter.colorRange = 0;
    }

    if (this.info.hue !== undefined) {
      // convert 0 ~ 360 to 0 ~ 180 -> -180 ~ 0
      hsvFilter.hue = this.info.hue > 180 ? this.info.hue - 360 : this.info.hue;
    } else if (hsvFilter.hue !== 0) {
      hsvFilter.hue = 0;
    }
    // current not accurate
    if (this.info.saturation !== undefined) {
      // convert -99 ~ 99 to -1 ~ 1
      const saturation = this.info.saturation / 100;
      hsvFilter.saturation = saturation;
    } else if (hsvFilter.saturation !== 0) {
      hsvFilter.saturation = 0;
    }
    // current not accurate
    if (this.info.brightness !== undefined) {
      // convert -99 ~ 99 to -1 ~ 1
      const brightness = this.info.brightness / 100;
      hsvFilter.lightness = brightness;
    } else if (hsvFilter.lightness !== 0) {
      hsvFilter.lightness = 0;
    }
    if (this.info.alpha !== undefined) {
      hsvFilter.alpha = this.info.alpha / 100;
    } else if (hsvFilter.alpha !== 1) {
      hsvFilter.alpha = 1;
    }
  }

  applyFilter() {
    for (const actionItem of this.actionPieces.values()) {
      for (const part of actionItem.allPieces) {
        if (part.filters !== this.filters) {
          part.filters = this.filters;
        }
      }
      for (const part of actionItem.allAnimatablePieces) {
        if (part.filters !== this.filters) {
          part.filters = this.filters;
        }
      }
    }
    const effectItems = [
      ...this.effectPieces.values(),
      ...this.setEffectPieces.values(),
    ];
    for (const actionItem of effectItems) {
      for (const part of actionItem.allAnimatablePieces) {
        if (part.filters !== this.filters) {
          part.filters = this.filters;
        }
      }
    }
  }

  updateEffectVisibility() {
    const visible = this.info.visibleEffect ?? true;
    const allEffectItems = Array.from(this.effectPieces.values())
      .concat(Array.from(this.setEffectPieces.values()))
      .flatMap((item) => Array.from(item.animatableItems.values()).flat());
    for (const animatableItem of allEffectItems) {
      animatableItem.visible = visible;
    }
  }

  getEffect(action: CharacterAction) {
    return this.effectPieces.get(action) || this.effectPieces.get('default');
  }
  getSetEffect(action: CharacterAction) {
    return (
      this.setEffectPieces.get(action) || this.setEffectPieces.get('default')
    );
  }

  destroy() {
    for (const actionItem of this.actionPieces.values()) {
      actionItem.destroy();
    }
    for (const item of this.effectPieces.values()) {
      item.destroy();
    }
    for (const item of this.setEffectPieces.values()) {
      item.destroy();
    }
    this.actionPieces.clear();
    this.effectPieces.clear();
    this.setEffectPieces.clear();
  }
}
