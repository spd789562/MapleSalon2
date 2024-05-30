import { CharacterLoader } from './loader';

import type { Character } from './character';
import type {
  ItemInfo,
  RenderItemInfo,
  PieceName,
  RenderPieceInfo,
  PieceIslot,
  PieceVslot,
  AncherName,
  Vec2,
} from './const/data';
import type { WzItem } from './const/wz';

import { CharacterAction } from './const/actions';
import { isFaceId } from '@/utils/itemId';

import { CharacterActionItem, CharacterFaceItem } from './categorizedItem';
import { CharacterExpressions } from './const/emotions';

export class CharacterItem implements RenderItemInfo {
  info: ItemInfo;
  pieces: Map<PieceName, RenderPieceInfo[]>;
  islot: PieceIslot[];
  vslot: PieceVslot[];

  actionPieces: Map<
    CharacterAction | CharacterExpressions,
    CharacterActionItem | CharacterFaceItem
  >;

  action: CharacterAction;

  character: Character;

  wz: WzItem | null = null;

  constructor(info: ItemInfo, character: Character) {
    this.info = info;
    this.pieces = new Map();
    this.actionPieces = new Map();
    this.islot = [];
    this.vslot = [];

    this.character = character;
    this.action = character.action;
  }

  get isFace() {
    return isFaceId(this.info.id);
  }

  get isAllAncherBuilt() {
    return Array.from(this.actionPieces.values()).every(
      (actionItem) => actionItem.isAllAncherBuilt,
    );
  }

  private loadFace() {
    if (this.wz === null) {
      return;
    }
    const expressionNeedToBuild = Object.values(CharacterExpressions);
    const expressions = Object.keys(this.wz).filter((key) =>
      expressionNeedToBuild.includes(key as CharacterExpressions),
    ) as CharacterExpressions[];
    for (const expression of expressions) {
      const expressionWz = this.wz[expression];

      if (!expressionWz) {
        continue;
      }

      const actionItem = new CharacterFaceItem(expression, expressionWz, this);

      this.actionPieces.set(expression, actionItem);
    }
  }
  private loadAction() {
    if (this.wz === null) {
      return;
    }
    const actionNeedToBuild = Object.values(CharacterAction);
    const actions = Object.keys(this.wz).filter((key) =>
      actionNeedToBuild.includes(key as CharacterAction),
    ) as CharacterAction[];

    for (const action of actions) {
      const actionWz = this.wz[action];

      if (!actionWz) {
        continue;
      }

      const actionItem = new CharacterActionItem(action, actionWz, this);

      this.actionPieces.set(action, actionItem);
    }
  }

  private loadWeapon() {}

  async load() {
    if (this.wz) {
      return;
    }

    this.wz = await CharacterLoader.getPieceWz(this.info.id);

    if (this.wz === null) {
      return;
    }

    this.islot = (this.wz.info.islot.match(/.{1,2}/g) || []) as PieceIslot[];
    this.vslot = (this.wz.info.vslot.match(/.{1,2}/g) || []) as PieceIslot[];

    if (this.isFace) {
      this.loadFace();
    } else {
      this.loadAction();
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
}
