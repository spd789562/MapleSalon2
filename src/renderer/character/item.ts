import { ColorMatrixFilter } from 'pixi.js';
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
import type { WzItem } from './const/wz';

import { CharacterAction } from './const/actions';
import { isFaceId, isWeaponId, isCashWeaponId, isHairId } from '@/utils/itemId';
import {
  gatFaceAvailableColorIds,
  gatHairAvailableColorIds,
  getFaceColorId,
  getHairColorId,
} from '@/utils/mixDye';

import { CharacterActionItem, CharacterFaceItem } from './categorizedItem';
import { CharacterExpressions } from './const/emotions';
import { CharacterHandType } from './const/hand';

export class CharacterItem implements RenderItemInfo {
  info: ItemInfo;
  islot: PieceIslot[];
  vslot: PieceVslot[];

  actionPieces: Map<
    CharacterAction | CharacterExpressions,
    CharacterActionItem | CharacterFaceItem
  >;

  character: Character;

  wz: WzItem | null = null;

  filters: ColorMatrixFilter[] = [];

  avaliableDye = new Map<ItemDyeInfo['color'], number>();

  constructor(info: ItemInfo, character: Character) {
    this.info = info;
    this.actionPieces = new Map();
    this.islot = [];
    this.vslot = [];

    this.character = character;
    this.updateFilter();
  }

  get isFace() {
    return isFaceId(this.info.id);
  }

  get isHair() {
    return isHairId(this.info.id);
  }

  get isWeapon() {
    return isWeaponId(this.info.id) || isCashWeaponId(this.info.id);
  }

  get isAllAncherBuilt() {
    return Array.from(this.actionPieces.values()).every(
      (actionItem) => actionItem.isAllAncherBuilt,
    );
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
  }
  private loadAction(wz: WzItem) {
    const actionNeedToBuild = Object.values(CharacterAction);
    const actions = Object.keys(wz).filter((key) =>
      actionNeedToBuild.includes(key as CharacterAction),
    ) as CharacterAction[];

    for (const action of actions) {
      const actionWz = wz[action];

      if (!actionWz) {
        continue;
      }

      const actionItem = new CharacterActionItem(action, actionWz, this);

      this.actionPieces.set(action, actionItem);
    }
  }
  private loadWeapon(wz: WzItem) {
    const isSingleHand =
      this.character.handType === CharacterHandType.SingleHand;
    const idIncurrment = isSingleHand ? -1 : 1;
    const [start, end] = isSingleHand ? [69, 30] : [30, 69];
    /* single hand weapon usually has higher id */
    for (let id = start; id !== end; id += idIncurrment) {
      const weaponWz = wz[id];
      if (!weaponWz) {
        continue;
      }
      this.loadAction(weaponWz as unknown as WzItem);
    }
  }

  async load() {
    if (!this.wz) {
      this.wz = await CharacterLoader.getPieceWz(this.info.id);
    }

    if (this.wz === null) {
      return;
    }

    this.islot = (this.wz.info.islot.match(/.{1,2}/g) || []) as PieceIslot[];
    this.vslot = (this.wz.info.vslot.match(/.{1,2}/g) || []) as PieceIslot[];

    /* resolve dye */
    if (this.isFace) {
      const ids = gatFaceAvailableColorIds(this.info.id);
      this.avaliableDye = new Map(ids.map((id) => [getFaceColorId(id), id]));
    } else if (this.isHair) {
      const ids = gatHairAvailableColorIds(this.info.id);
      this.avaliableDye = new Map(ids.map((id) => [getHairColorId(id), id]));
    }

    if (this.isFace) {
      this.loadFace(this.wz);
    } else if (this.isWeapon) {
      this.loadWeapon(this.wz);
    } else {
      this.loadAction(this.wz);
    }

    for await (const actionItem of this.actionPieces.values()) {
      await actionItem.prepareResourece();
    }
  }
  tryBuildAncher(
    action: CharacterAction,
    currentAnchers: Map<AncherName, Vec2>[],
  ): Map<AncherName, Vec2>[] {
    let item: CharacterActionItem | CharacterFaceItem | undefined;
    if (this.isFace) {
      item = this.actionPieces.get(this.character.expression);
    } else {
      item = this.actionPieces.get(action);
    }
    if (!item) {
      return currentAnchers;
    }
    return item.tryBuildAncher(currentAnchers);
  }

  updateFilter() {
    if (this.filters.length === 0) {
      this.filters = [
        new ColorMatrixFilter({ blendMode: 'multiply' }),
        new ColorMatrixFilter({ blendMode: 'multiply' }),
        new ColorMatrixFilter({ blendMode: 'multiply' }),
      ];
    }
    const hueFilter = this.filters[0];
    const satFilter = this.filters[1];
    const brightFilter = this.filters[2];

    if (this.info.hue !== undefined) {
      hueFilter.hue(this.info.hue, true);
    }
    if (this.info.saturation !== undefined) {
      // convert -99 ~ 99 to -1 ~ 1
      const saturation = this.info.saturation / 100;
      satFilter.saturate(saturation, true);
    }
    // current not working
    // if (this.info.brightness !== undefined) {
    //   // convert -99 ~ 99 to 0 ~ 2
    //   const brightness = (this.info.brightness / 2 + 100) / 100;
    //   brightFilter.brightness(brightness, true);
    // }
    // if (this.info.contrast !== undefined) {
    // disable for now
    //   filter.contrast(this.info.contrast, true);
    // }
  }
}
