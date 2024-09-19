import { Container, type DestroyOptions } from 'pixi.js';

import type { PieceSlot } from './const/data';
import { defaultAncher } from './const/ancher';
import type { CharacterStaticPart } from './characterStaticPart';
import type { DyeableCharacterItemPiece } from './itemPiece';
import type { Character } from './character';
import type { CharacterActionItem, CategorizedItem } from './categorizedItem';

import { CharacterLoader } from './loader';
import { CharacterZmapContainer } from './characterZmapContainer';

import { CharacterAction } from '@/const/actions';

type AnyCategorizedItem = CategorizedItem<string>;

export class CharacterBodyFrame extends Container {
  character: Character;

  anchers = new Map([['navel', defaultAncher.navel]]);

  action = CharacterAction.Stand1;
  frame = 0;

  zmapLayers = new Map<PieceSlot, CharacterZmapContainer>();
  pieces: [PieceSlot, CharacterStaticPart[]][] = [];

  constructor(character: Character, action: CharacterAction, frame: number) {
    super();
    this.character = character;
    this.action = action;
    this.frame = frame;
  }

  clearAncher() {
    this.anchers.clear();
    this.anchers.set('navel', defaultAncher.navel);
  }

  buildAncher() {
    for (const item of this.character.idItems.values()) {
      this.anchers = item.tryBuildAncherByFrame(
        this.action,
        this.anchers,
        this.frame,
      );
    }
  }

  getItemsWithOptions(options: {
    layer: PieceSlot;
    frame: number;
    action: CharacterAction;
  }) {
    const items = Array.from(this.character.idItems.values())
      .map((item) => {
        return item.isUseExpressionItem
          ? item.actionPieces.get(this.character.expression)
          : item.actionPieces.get(options.action);
      })
      .filter((item) => item) as AnyCategorizedItem[];

    return items
      .flatMap((item) =>
        (item.items.get(options.layer) || []).map(
          (i) => i[options.frame % i.length],
        ),
      )
      .filter((item) => item);
  }

  updatePieces() {
    const zmap = CharacterLoader?.zmap;
    if (!zmap) {
      return;
    }
    this.reset();
    const earPiece = this.earPiece;
    const earLayer = earPiece?.[0]?.frameData.z;

    this.pieces = [];
    for (const layer of zmap) {
      const itemsByLayer = this.getItemsWithOptions({
        layer,
        action: this.action,
        frame: this.frame,
      });
      if (earPiece && earLayer === layer) {
        itemsByLayer.push(...earPiece);
      }
      if (itemsByLayer.length === 0) {
        continue;
      }
      this.pieces.push([layer, itemsByLayer]);
    }
  }

  renderPieces() {
    const zmap = CharacterLoader?.zmap;
    if (!zmap) {
      return;
    }

    let isOverrideFace = false;

    for (const [layer, pieces] of this.pieces) {
      let container = this.zmapLayers.get(layer);
      if (!container) {
        container = new CharacterZmapContainer(
          layer,
          zmap.indexOf(layer),
          this.character,
        );
        this.addChild(container);
        this.zmapLayers.set(layer, container);
      }

      for (const piece of pieces) {
        if (piece.isEmpty) {
          continue;
        }

        if (piece.item.isOverrideFace) {
          isOverrideFace = true;
        }
        piece.updateAncher();
        const ancherName = piece.frameData.baseAncherName;
        const ancher = this.anchers.get(ancherName);
        /* setting the ancher on each piece */
        ancher &&
          piece.pivot?.copyFrom({
            x: -ancher.x,
            y: -ancher.y,
          });

        container.addCharacterPart(piece);
      }

      container.refreshLock();
    }

    const facePiece = this.facePiece;
    if (facePiece) {
      facePiece.visible = !isOverrideFace;
    }

    this.updateCharacterFaceVisibility();
    this.updateCharacterPivotByBodyPiece();
  }

  async updateMixDye(id: number) {
    const dyeableSprites = this.currentPieces
      .filter(
        (piece) => piece.item.info.id === id && piece.frameData?.isDyeable?.(),
      )
      .map((piece) => piece.frameData) as DyeableCharacterItemPiece[];
    /* only update sprite already in render */
    for await (const sprites of dyeableSprites) {
      await sprites.updateDye();
    }
  }

  async prepareResourece() {
    for (const item of this.character.idItems.values()) {
      if (item.isUseExpressionItem) {
        await item.prepareActionResourceByFrame(
          this.character.expression,
          this.frame,
        );
      } else {
        await item.prepareActionResourceByFrame(this.action, this.frame);
      }
    }
  }

  reset() {
    this.clearnContainerChild();
  }
  clearnContainerChild() {
    for (const [layer, container] of this.zmapLayers.entries()) {
      // not remove face's child for now, it will cause some face missing bug
      if (layer === 'face') {
        continue;
      }
      container.removeChildren();
    }
  }
  /** update face when character turn to back */
  updateCharacterFaceVisibility() {
    const faceLayer = this.zmapLayers.get('face');
    if (faceLayer) {
      if (this.isBackAction) {
        faceLayer.visible = false;
      } else {
        faceLayer.visible = true;
      }
    }
  }
  updateCharacterPivotByBodyPiece() {
    /* use the ancher to set actual character offset */
    const bodyPos = this.bodyFrame?.ancher || { x: 0, y: 0 };
    this.pivot?.set(bodyPos.x, bodyPos.y);
  }

  get facePiece() {
    return this.currentPieces.find((e) => e.item.isFace);
  }

  get earPiece() {
    const headItem = this.character.headItem;
    if (!headItem) {
      return undefined;
    }
    const headCategoryItem = headItem.actionPieces.get(
      this.action,
    ) as CharacterActionItem;

    const ears =
      headCategoryItem?.getAvailableEar(this.character.earType) || [];

    return ears.map((item) => item[this.frame % 1] /* .clone() */);
  }

  /** get current pieces in character layers */
  get currentPieces() {
    return this.pieces.flatMap(([_, pieces]) => pieces);
  }

  /** use backBody to check current action is turn character to back  */
  get isBackAction() {
    const backBodyNode = this.backBodyNode;
    const isEmptyNode = backBodyNode?.frameData?.zIndex !== -1;
    return backBodyNode && isEmptyNode;
  }

  get frontBodyNode() {
    const body = this.zmapLayers.get('body');

    return body?.children.find(
      (child) => (child as CharacterStaticPart).item.isBody,
    ) as CharacterStaticPart | undefined;
  }
  get backBodyNode() {
    const body = this.zmapLayers.get('backBody');
    return body?.children.find(
      (child) => (child as CharacterStaticPart).item.isBody,
    ) as CharacterStaticPart | undefined;
  }

  get currentBodyNode() {
    const bodyNode = this.frontBodyNode;
    if (bodyNode) {
      return bodyNode;
    }
    return this.backBodyNode;
  }

  get bodyFrame() {
    const bodyNode = this.frontBodyNode;
    const bodyFrame = bodyNode?.frameData;
    if (bodyFrame && bodyFrame.zIndex !== -1) {
      return bodyFrame;
    }
    const backNode = this.backBodyNode;
    return backNode?.frameData;
  }

  get isAllAncherBuilt() {
    return Array.from(this.character.idItems.values()).every((item) =>
      item.isAncherAncherBuiltByFrame(this.action, this.frame),
    );
  }

  destroy(options?: DestroyOptions) {
    this.clearnContainerChild();
    super.destroy(options);
    this.zmapLayers.clear();
    this.anchers.clear();
  }
}
