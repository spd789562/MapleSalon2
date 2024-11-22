import type { PieceSlot } from './const/data';
import { defaultAncher } from './const/ancher';
import { FrontFaceLayers } from './const/zmap';
import type { CharacterStaticPart } from './characterStaticPart';
import type { DyeableCharacterItemPiece } from './itemPiece';
import type { Character } from './character';
import type { CategorizedItem } from './categorizedItem';
import type { CharacterZmapContainer } from './characterZmapContainer';

import { CharacterLoader } from './loader';

import { CharacterExpressions } from '@/const/emotions';
import type { CharacterBodyFrame } from './characterBodyFrame';

type AnyCategorizedItem = CategorizedItem<string>;

/**
 * A CharacterFaceFrame is represent a character face frame
 * and hold references to all piece will need it this expression
 */
export class CharacterFaceFrame {
  character: Character;

  anchers = new Map([['navel', defaultAncher.navel]]);

  expression = CharacterExpressions.Default;
  frame = 0;

  pieces: [PieceSlot, CharacterStaticPart[]][] = [];

  constructor(
    character: Character,
    action: CharacterExpressions,
    frame: number,
  ) {
    this.character = character;
    this.expression = action;
    this.frame = frame;
  }

  clearAncher() {
    this.anchers.clear();
    this.anchers.set('navel', defaultAncher.navel);
  }

  buildAncher() {
    for (const item of this.character.idItems.values()) {
      if (item.isUseExpressionItem) {
        this.anchers = item.tryBuildAncherByFrame(
          this.expression,
          this.anchers,
          this.frame,
        );
      }
    }
  }

  getItemsWithOptions(options: {
    layer: PieceSlot;
    frame: number;
    expression: CharacterExpressions;
  }) {
    const items = Array.from(this.character.idItems.values())
      .filter((item) => item.isUseExpressionItem)
      .map((item) => {
        return item.actionPieces.get(this.expression);
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

    this.pieces = [];
    for (const layer of zmap) {
      const itemsByLayer = this.getItemsWithOptions({
        layer,
        expression: this.expression,
        frame: this.frame,
      });
      if (itemsByLayer.length === 0) {
        continue;
      }
      this.pieces.push([layer, itemsByLayer]);
    }
  }

  renderPieces(bodyFrame?: CharacterBodyFrame) {
    const zmap = CharacterLoader?.zmap;
    if (!(zmap && bodyFrame)) {
      return;
    }

    let isOverrideFace = false;
    const isHideFace =
      (bodyFrame.action as string) === 'blink' ||
      (bodyFrame.action as string) === 'hide';

    for (const [layer, pieces] of this.pieces) {
      const container = this.character.getOrCreatZmapLayer(zmap, layer);

      for (const piece of pieces) {
        if (piece.isEmpty || piece.destroyed) {
          continue;
        }

        if (piece.item.isOverrideFace) {
          isOverrideFace = true;
        }
        piece.updateAncher();
        /* assume all face item use brow ancher */
        const ancherName = 'brow';
        /* need current body frame to get current brow ancher */
        const ancher = bodyFrame.anchers.get(ancherName);
        const pieceAncher = piece.frameData.map[ancherName];
        /* setting the ancher on each piece */
        if (ancher) {
          const pivot = {
            x: -ancher.x + (pieceAncher?.x || 0),
            y: -ancher.y + (pieceAncher?.y || 0),
          };
          piece.pivot?.copyFrom(pivot);
        }

        container.addCharacterPart(piece);
      }

      container.refreshLock();
    }

    const facePiece = this.facePiece;
    if (facePiece) {
      facePiece.visible = !isOverrideFace;
    }

    this.updateCharacterFaceVisibility(isHideFace);
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
        await item.prepareActionResourceByFrame(this.expression, this.frame);
      }
    }
  }

  reset() {
    this.clearnContainerChild();
  }
  clearnContainerChild() {
    for (const container of this.character.zmapLayers.values()) {
      container.removeChildren();
    }
  }
  /** update face related when character turn to back */
  updateCharacterFaceVisibility(forceHide?: boolean) {
    const faceLayers = FrontFaceLayers.reduce((layers, layerName) => {
      const zmapLayer = this.character.zmapLayers.get(layerName);
      if (zmapLayer) {
        layers.push(zmapLayer);
      }
      return layers;
    }, [] as CharacterZmapContainer[]);
    for (const layer of faceLayers) {
      layer.visible = forceHide ? false : !this.isBackAction;
    }
  }

  get facePiece() {
    return this.currentPieces.find((e) => e.item.isFace);
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
  get backBodyNode() {
    const body = this.character.zmapLayers.get('backBody');
    return body?.children.find(
      (child) => (child as CharacterStaticPart).item.isBody,
    ) as CharacterStaticPart | undefined;
  }

  get isAllAncherBuilt() {
    return Array.from(this.character.idItems.values()).every((item) =>
      item.isAncherAncherBuiltByFrame(this.expression, this.frame),
    );
  }

  destroy() {
    this.clearnContainerChild();
    this.anchers.clear();
  }
}
