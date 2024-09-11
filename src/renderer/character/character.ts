import { createUniqueId } from 'solid-js';
import {
  type Application,
  Container,
  Ticker,
  EventEmitter,
  Graphics,
  type DestroyOptions,
} from 'pixi.js';

import type { CharacterData } from '@/store/character/store';
import type { ItemInfo, AncherName, Vec2, PieceSlot } from './const/data';
import type {
  CategorizedItem,
  CharacterActionItem,
  CharacterFaceItem,
} from './categorizedItem';
import type { CharacterAnimatablePart } from './characterAnimatablePart';
import type {
  CharacterItemPiece,
  DyeableCharacterItemPiece,
} from './itemPiece';

import { CharacterLoader } from './loader';
import { CharacterItem } from './item';
import { CharacterZmapContainer } from './characterZmapContainer';

import { isMixDyeableId } from '@/utils/itemId';

import { CharacterAction, isBackAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterEarType } from '@/const/ears';
import { CharacterHandType } from '@/const/hand';
import type { PieceIslot } from './const/slot';
import { BaseNameTag } from '../nameTag/baseNameTag';

type AnyCategorizedItem = CategorizedItem<string>;

function generateDebugAncher(radius = 8, color = 0xff0000) {
  const graphics = new Graphics();
  graphics.moveTo(-radius, 0);
  graphics.lineTo(radius, 0);
  graphics.moveTo(0, -radius);
  graphics.lineTo(0, radius);
  graphics.stroke({
    color,
    width: 1,
  });

  return graphics;
}

export interface CharacterAttributes {
  action: CharacterAction;
  expression: CharacterExpressions;
  earType: CharacterEarType;
  handType: CharacterHandType;
}

export class Character extends Container {
  name = '';
  nameTag: BaseNameTag;
  idItems = new Map<number, CharacterItem>();
  actionAnchers = new Map<CharacterAction, Map<AncherName, Vec2>[]>();

  #_action = CharacterAction.Jump;
  #_expression: CharacterExpressions = CharacterExpressions.Default;
  #_earType = CharacterEarType.HumanEar;
  #_handType = CharacterHandType.DoubleHand;
  #_renderId = '';

  zmapLayers = new Map<PieceSlot, CharacterZmapContainer>();
  bodyContainer = new Container();
  locks = new Map<PieceSlot, number>();

  frame = 0;
  /** is character playing bounced action */
  isBounce = false;
  isPlaying = false;
  isAnimating = false;

  isHideAllEffect = false;

  /* delta to calculate is need enter next frame */
  currentDelta = 0;
  currentTicker?: (delta: Ticker) => void;

  app?: Application;

  isLoading = false;
  loadFlashTimer = 0;
  loadEvent = new EventEmitter<'loading' | 'loaded' | 'error'>();

  constructor(app?: Application) {
    super();
    // this.sortableChildren = true;
    this.bodyContainer.sortableChildren = true;
    this.app = app;
    this.nameTag = new BaseNameTag('');
    this.nameTag.visible = false;
    this.nameTag.position.set(0, 3);
    this.addChild(this.bodyContainer);
    this.addChild(this.nameTag);
  }

  get action() {
    return this.#_action;
  }
  get expression() {
    return this.#_expression;
  }
  get earType() {
    return this.#_earType;
  }
  get handType() {
    return this.#_handType;
  }
  set action(action: CharacterAction) {
    this.#_action = action;

    this.updateFaceVisibilityByAction();
    // this.updateHandTypeByAction();
  }
  set expression(expression: CharacterExpressions) {
    this.#_expression = expression;
  }
  set earType(earType: CharacterEarType) {
    this.#_earType = earType;
  }
  set handType(handType: CharacterHandType) {
    this.#_handType = handType;

    this.updateActionByHandType();
  }

  async update(characterData: CharacterData) {
    const isPlayingChanged = this.isAnimating !== characterData.isAnimating;
    const isStopToPlay = !this.isAnimating && characterData.isAnimating;
    if (!characterData.isAnimating) {
      this.frame = characterData.frame || 0;
      this.stop();
    }
    this.isAnimating = characterData.isAnimating;
    const hasAttributeChanged = this.updateAttribute(characterData);
    const hasAddAnyItem = await this.updateItems(
      Object.values(characterData.items),
    );

    if (characterData.showNameTag) {
      this.nameTag.visible = true;
      await this.nameTag.updateNameTagData(
        characterData.name || '',
        characterData.nameTagId,
      );
    } else {
      this.nameTag.visible = false;
    }

    if (hasAttributeChanged || hasAddAnyItem || isStopToPlay) {
      await this.loadItems();
    } else if (isPlayingChanged) {
      this.render();
    }
  }

  updateAttribute(attributes: Partial<CharacterAttributes>) {
    let hasChange = false;
    if (attributes.action && attributes.action !== this.#_action) {
      hasChange = true;
      this.action = attributes.action;
    }
    if (attributes.expression && attributes.expression !== this.#_expression) {
      hasChange = true;
      this.expression = attributes.expression;
    }
    if (attributes.earType && attributes.earType !== this.#_earType) {
      hasChange = true;
      this.earType = attributes.earType;
    }
    if (attributes.handType && attributes.handType !== this.#_handType) {
      hasChange = true;
      this.handType = attributes.handType;
    }
    return hasChange;
  }

  async updateItems(items: ItemInfo[]) {
    let isAddItem = false;
    for (const item of items) {
      if (this.idItems.has(item.id)) {
        this.updateFilter(item.id, item);
        if (isMixDyeableId(item.id)) {
          await this.updateMixDye(item.id, item);
        }
      } else {
        isAddItem = true;
        const chItem = new CharacterItem(item, this);
        this.idItems.set(item.id, chItem);
      }
    }
    for (const item of this.idItems.keys()) {
      if (!items.find((i) => i.id === item)) {
        isAddItem = true;
        const removedItem = this.idItems.get(item);
        removedItem?.destroy();
        this.idItems.delete(item);
      }
    }
    return isAddItem;
  }

  updateFilter(id: number, info: ItemInfo) {
    const item = this.idItems.get(id);
    if (!item) {
      return;
    }
    item.info = info;
    item.updateFilter();
  }
  async updateMixDye(id: number, info: ItemInfo) {
    const item = this.idItems.get(id);
    if (!item) {
      return;
    }
    item.info = Object.assign({}, info, {
      dye: (info as unknown as ItemInfo & { isDeleteDye: boolean }).isDeleteDye
        ? undefined
        : info.dye,
    });
    /* only update sprite already in render */
    const dyeableSprites = this.currentAllItem
      .flatMap((item) => Array.from(item.allPieces))
      .filter((piece) => piece.item.info.id === id)
      .flatMap((piece) =>
        piece.frames.filter((frame) => frame.isDyeable?.()),
      ) as DyeableCharacterItemPiece[];
    for await (const sprites of dyeableSprites) {
      await sprites.updateDye();
    }
  }

  /** get current items filter by expression and action */
  get currentAllItem() {
    return Array.from(this.idItems.values())
      .map((item) => {
        return item.isUseExpressionItem
          ? item.actionPieces.get(this.expression)
          : item.actionPieces.get(this.action);
      })
      .filter((item) => item) as AnyCategorizedItem[];
  }

  /** get current pieces in character layers */
  get currentPieces() {
    return Array.from(this.zmapLayers.values()).flatMap(
      (layer) => layer.children as CharacterAnimatablePart[],
    );
  }

  render() {
    const zmap = CharacterLoader?.zmap;
    if (!zmap) {
      return;
    }
    this.reset();
    const pieces: CharacterAnimatablePart[] = [];
    let body: CharacterAnimatablePart | undefined = undefined;
    let isOverrideFace = false;
    const earPiece = this.getEarPiece();
    const earLayer = earPiece?.firstFrameZmapLayer;
    for (const layer of zmap) {
      const itemsByLayer = this.getItemsByLayer(layer).concat(
        earPiece && earLayer === layer ? [earPiece] : [],
      );
      if (itemsByLayer.length === 0) {
        continue;
      }
      for (const piece of itemsByLayer) {
        let container = this.zmapLayers.get(layer);
        if (piece.effectZindex !== undefined) {
          /* make special layer for effects */
          /* ex: effect0 effect-1 effect2 */
          const effectLayerName = `effect${piece.effectZindex}`;
          const existLayer = this.zmapLayers.get(effectLayerName);
          if (existLayer) {
            container = existLayer;
          } else {
            const zIndex =
              piece.effectZindex >= 2
                ? zmap.length + piece.effectZindex
                : piece.effectZindex - 10;
            container = new CharacterZmapContainer(
              effectLayerName,
              zIndex,
              this,
            );
            this.bodyContainer.addChild(container);
            this.zmapLayers.set(effectLayerName, container);
          }
        } else if (!container) {
          container = new CharacterZmapContainer(
            layer,
            zmap.indexOf(layer),
            this,
          );
          this.bodyContainer.addChild(container);
          this.zmapLayers.set(layer, container);
        }
        if (
          isBackAction(this.action) &&
          layer.toLocaleLowerCase().includes('face')
        ) {
          container.visible = false;
        }
        if ((layer === 'body' || layer === 'backBody') && piece.item.isBody) {
          body = piece;
        }
        if (piece.item.isOverrideFace) {
          isOverrideFace = true;
        }
        // not sure why need to do this while it already initialized in constructor
        piece.frameChanges(0);

        pieces.push(piece);

        container.addCharacterPart(piece);
      }
    }

    if (!body) {
      console.error('No body found');
      return;
    }

    if (this.facePiece) {
      const facePiece = this.facePiece;
      for (const item of facePiece.allPieces) {
        item.visible = !isOverrideFace;
      }
    }

    this.playPieces(this.currentPieces);
    if (this.isAnimating) {
      this.nameTag.play();
      this.playByBody(body);
    }

    this.isLoading = false;
    this.loadEvent.emit('loaded');
  }

  play(frame = 0) {
    if (this.isPlaying) {
      return;
    }
    this.isAnimating = true;
    this.frame = frame;
    this.nameTag.play();
    return this.loadItems();
  }
  stop() {
    this.isBounce = false;
    this.isLoading = false;
    this.isPlaying = false;
    this.currentDelta = 0;
    if (this.currentTicker) {
      Ticker.shared.remove(this.currentTicker);
      this.currentTicker = undefined;
    }
    this.nameTag.stop();
  }
  reset() {
    this.stop();
    this.clearnContainerChild();
  }
  clearnContainerChild() {
    for (const child of this.zmapLayers.values()) {
      for (const pieces of child.children) {
        if ('stop' in pieces) {
          (pieces as CharacterAnimatablePart).stop();
        }
      }
      child.removeChildren();
    }
  }

  /** play character action by body's delay */
  playByBody(body: CharacterAnimatablePart) {
    const pieces = this.currentPieces;
    const maxFrame = body.frames.length;
    const needBounce =
      this.action === CharacterAction.Alert || this.action.startsWith('stand');

    this.currentTicker = (delta) => {
      this.currentDelta += delta.deltaMS;
      if (this.currentDelta > body.currentDuration) {
        this.currentDelta = 0;
        if (needBounce) {
          if (this.frame >= maxFrame - 1) {
            this.isBounce = true;
          }
          if (this.frame <= 0) {
            this.isBounce = false;
          }
          this.frame += this.isBounce ? -1 : 1;
        } else {
          this.frame += 1;
          if (this.frame >= maxFrame) {
            this.frame = 0;
          }
        }
        this.playPieces(pieces);
      }
    };

    Ticker.shared.add(this.currentTicker);
  }

  /** set pieces to current frame */
  playPieces(pieces: CharacterAnimatablePart[]) {
    const frame = this.frame;

    const currentAncher = this.actionAnchers.get(this.action)?.[frame];

    if (!currentAncher) {
      return;
    }
    for (const piece of pieces) {
      const pieceFrameIndex = piece.frames[frame] ? frame : 0;
      const pieceFrame = (piece.frames[frame] ||
        piece.frames[0]) as CharacterItemPiece;
      const isSkinGroup = pieceFrame.group === 'skin';
      if (!pieceFrame) {
        continue;
      }
      const ancherName = pieceFrame.baseAncherName;
      const ancher = currentAncher.get(ancherName);
      /* setting the ancher on each piece */
      ancher &&
        piece.pivot?.copyFrom({
          x: -ancher.x,
          y: -ancher.y,
        });

      /* some part can play indenpendently */
      if (piece.canIndependentlyPlay && !isSkinGroup) {
        if (this.isAnimating) {
          !piece.playing && piece.play();
        } else {
          piece.gotoAndStop(0);
        }
      } else {
        piece.currentFrame = pieceFrameIndex;
      }
    }
    this.updateCharacterFaceVisibility();
    /* update pivot after all pieces is set */
    this.updateCharacterPivotByBodyPiece();
  }

  /** update face when character turn to back */
  updateCharacterFaceVisibility() {
    const faceLayer = this.zmapLayers.get('face');
    if (faceLayer) {
      if (this.isCurrentFrameIsBackAction) {
        faceLayer.visible = false;
      } else {
        faceLayer.visible = true;
      }
    }
  }
  updateCharacterPivotByBodyPiece() {
    /* use the ancher to set actual character offset */
    const bodyPos = this.currentBodyFrame?.ancher || { x: 0, y: 0 };
    this.bodyContainer.pivot?.set(bodyPos.x, bodyPos.y);
  }

  /** use backBody to check current action is turn character to back  */
  get isCurrentFrameIsBackAction() {
    const backBodyNode = this.currentBackBodyNode;
    const isEmptyNode = backBodyNode?.frames[this.frame]?.zIndex !== -1;
    return backBodyNode && isEmptyNode;
  }

  get currentFrontBodyNode() {
    const body = this.zmapLayers.get('body');
    return body?.children.find(
      (child) => (child as CharacterAnimatablePart).item.isBody,
    ) as CharacterAnimatablePart | undefined;
  }
  get currentBackBodyNode() {
    const body = this.zmapLayers.get('backBody');
    return body?.children.find(
      (child) => (child as CharacterAnimatablePart).item.isBody,
    ) as CharacterAnimatablePart | undefined;
  }

  get currentBodyNode() {
    const bodyNode = this.currentFrontBodyNode;
    if (bodyNode) {
      return bodyNode;
    }
    return this.currentBackBodyNode;
  }

  get currentBodyFrame() {
    const bodyNode = this.currentFrontBodyNode;
    const bodyFrame = bodyNode?.frames[this.frame];
    if (bodyFrame && bodyFrame.zIndex !== -1) {
      return bodyFrame;
    }
    const backNode = this.currentBackBodyNode;
    return backNode?.frames[this.frame];
  }

  get isAllAncherBuilt() {
    return Array.from(this.idItems.values()).every(
      (item) => item.isAllAncherBuilt,
    );
  }
  get isCurrentActionAncherBuilt() {
    return Array.from(this.idItems.values()).every((item) =>
      item.isActionAncherBuilt(this.action),
    );
  }

  get effectLayers() {
    const zMapLayers = this.zmapLayers;
    return function* effectGenerator() {
      for (const [layerName, layer] of zMapLayers.entries()) {
        if (!layerName.includes('effect')) {
          continue;
        }
        yield layer;
      }
    };
  }
  get facePiece() {
    const faceItem = Array.from(this.idItems.values()).find(
      (item) => item.isFace,
    );
    if (!faceItem) {
      return undefined;
    }
    return faceItem.actionPieces.get(this.expression) as CharacterFaceItem;
  }
  getEarPiece() {
    const headItem = Array.from(this.idItems.values()).find(
      (item) => item.isHead,
    );
    if (!headItem) {
      return undefined;
    }
    const headCategoryItem = headItem.actionPieces.get(
      this.action,
    ) as CharacterActionItem;

    const earItems = headCategoryItem?.getAvailableEar(this.earType);

    return earItems?.[0];
  }

  getItemsByLayer(layer: PieceSlot) {
    return this.currentAllItem.flatMap((item) => item.items.get(layer) || []);
  }

  async loadItems() {
    const renderId = createUniqueId();
    this.#_renderId = renderId;

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
    }, 100);

    const loadItems = Array.from(this.idItems.values()).map(async (item) => {
      try {
        await item.load();
        if (this.isAnimating) {
          if (item.isUseExpressionItem) {
            await item.prepareActionResource(this.expression);
          } else {
            await item.prepareActionResource(this.action);
          }
        } else if (item.isUseExpressionItem) {
          await item.prepareActionResourceByFrame(this.expression, this.frame);
        } else {
          await item.prepareActionResourceByFrame(this.action, this.frame);
        }
      } catch (_) {
        return item.info;
      }
    });

    const errorItems = await Promise.all(loadItems).then((items) =>
      items.filter((item) => item),
    );

    if (this.#_renderId !== renderId) {
      return;
    }

    if (errorItems.length > 0) {
      this.loadEvent.emit('error', errorItems);
    }

    const itemCount = this.idItems.size;
    // try to build ancher but up to 2 times of item count
    for (let i = 0; i < itemCount * 4; i++) {
      if (this.isCurrentActionAncherBuilt) {
        break;
      }
      this.buildAncherByAction(this.action);
    }

    this.buildLock();

    /* initizlize mixdye */
    const mixDyeItems = Array.from(this.idItems.values())
      .filter((item) => isMixDyeableId(item.info.id))
      .map((item) => this.updateMixDye(item.info.id, item.info));

    await Promise.all(mixDyeItems);

    this.render();
  }

  buildLock() {
    this.locks.clear();
    // build id from small to big
    const sortedItem = Array.from(this.idItems.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, item]) => item);
    const orderedItems = CharacterLoader.zmap?.reduce((acc, layer) => {
      for (const item of sortedItem) {
        if (item.islot.includes(layer as PieceIslot)) {
          acc.push(item);
        }
      }
      return acc;
    }, [] as CharacterItem[]);

    if (!orderedItems) {
      return;
    }
    for (const item of orderedItems) {
      for (const slot of item.vslot) {
        this.locks.set(slot, item.info.id);
      }
    }
  }

  buildAllAncher() {
    for (const action of Object.values(CharacterAction)) {
      for (const item of this.idItems.values()) {
        const ancher = this.actionAnchers.get(action);
        this.actionAnchers.set(
          action,
          item.tryBuildAncher(action, ancher || []),
        );
      }
    }
  }
  buildAncherByAction(action: CharacterAction) {
    for (const item of this.idItems.values()) {
      const ancher = this.actionAnchers.get(action);
      this.actionAnchers.set(action, item.tryBuildAncher(action, ancher || []));
    }
  }

  toggleEffectVisibility(isHide?: boolean, includeNormal = false) {
    this.isHideAllEffect = isHide ?? !this.isHideAllEffect;
    for (const layer of this.effectLayers()) {
      if (layer.name === 'effect' && !includeNormal) {
        layer.visible = true;
      } else {
        layer.visible = !this.isHideAllEffect;
      }
    }
  }

  private updateFaceVisibilityByAction() {
    const faceLayer = this.zmapLayers.get('face');
    if (faceLayer) {
      if (isBackAction(this.action)) {
        faceLayer.visible = false;
      } else {
        faceLayer.visible = true;
      }
    }
  }
  private updateActionByHandType() {
    if (this.#_handType === CharacterHandType.SingleHand) {
      if (this.action === CharacterAction.Walk2) {
        this.#_action = CharacterAction.Walk1;
      } else if (this.action === CharacterAction.Stand2) {
        this.#_action = CharacterAction.Stand1;
      }
    } else if (this.#_handType === CharacterHandType.DoubleHand) {
      if (this.action === CharacterAction.Walk1) {
        this.#_action = CharacterAction.Walk2;
      } else if (this.action === CharacterAction.Stand1) {
        this.#_action = CharacterAction.Stand2;
      }
    }
  }
  private updateHandTypeByAction() {
    if (
      (this.action === CharacterAction.Walk1 ||
        this.action === CharacterAction.Stand1) &&
      this.#_handType === CharacterHandType.DoubleHand
    ) {
      this.#_handType = CharacterHandType.SingleHand;
    } else if (
      (this.action === CharacterAction.Walk2 ||
        this.action === CharacterAction.Stand2) &&
      this.#_handType === CharacterHandType.SingleHand
    ) {
      this.#_handType = CharacterHandType.DoubleHand;
    }
  }
  destroy(options?: DestroyOptions) {
    this.reset();
    super.destroy(options);
    this.loadEvent.removeAllListeners();
    this.zmapLayers.clear();
    this.locks.clear();
    this.actionAnchers.clear();
    this.bodyContainer = undefined as unknown as any;
    for (const item of this.idItems.values()) {
      item.destroy();
    }
    this.idItems.clear();
  }
}
