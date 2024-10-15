import { createUniqueId } from 'solid-js';
import {
  Container,
  Ticker,
  EventEmitter,
  Graphics,
  type DestroyOptions,
} from 'pixi.js';

import type { CharacterData } from '@/store/character/store';
import type { ItemInfo, PieceSlot, Zmap } from './const/data';
import type { PieceIslot } from './const/slot';
import type { WzActionInstruction } from './const/wz';
import type { CategorizedItem, CharacterActionItem } from './categorizedItem';
import { CharacterLoader } from './loader';
import { CharacterItem } from './item';
import { CharacterBodyFrame } from './characterBodyFrame';
import { CharacterZmapContainer } from './characterZmapContainer';

import { isMixDyeableId } from '@/utils/itemId';

import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterEarType } from '@/const/ears';
import { CharacterHandType } from '@/const/hand';
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
  instruction?: string;
}

export class Character extends Container {
  name = '';
  nameTag: BaseNameTag;
  idItems = new Map<number, CharacterItem>();

  #_action = CharacterAction.Jump;
  #_instruction?: string;
  #_expression: CharacterExpressions = CharacterExpressions.Default;
  #_earType = CharacterEarType.HumanEar;
  #_handType = CharacterHandType.DoubleHand;
  #_renderId = '';

  zmapLayers = new Map<PieceSlot, CharacterZmapContainer>();
  effectLayers = new Map<number, Container>();
  bodyContainer = new Container();
  bodyFrame = new Container();
  locks = new Map<PieceSlot, number>();

  frame = 0;
  _instructionFrame = 0;
  currentInstructions: WzActionInstruction[] = [];
  bodyFrameMap = new Map<`${CharacterAction}-${number}`, CharacterBodyFrame>();

  isPlaying = false;
  isAnimating = false;

  isHideAllEffect = false;

  /* delta to calculate is need enter next frame */
  currentDelta = 0;
  currentTicker?: (delta: Ticker) => void;

  isLoading = false;
  loadFlashTimer = 0;
  loadEvent = new EventEmitter<'loading' | 'loaded' | 'error'>();

  constructor() {
    super();
    // this.sortableChildren = true;
    this.bodyContainer.sortableChildren = true;
    this.nameTag = new BaseNameTag('');
    this.nameTag.visible = false;
    this.nameTag.position.set(0, 3);
    this.addChild(this.bodyContainer);
    this.addChild(this.nameTag);
    this.bodyContainer.addChild(this.bodyFrame);
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

  get instructionFrame() {
    return this._instructionFrame;
  }
  set instructionFrame(frame: number) {
    this._instructionFrame = frame;
    this.frame = this.currentInstructions[frame]?.frame || 0;
  }
  get instruction(): string | undefined {
    return this.#_instruction;
  }
  set instruction(instruction: string | undefined) {
    this.#_instruction = instruction;
    const ins = instruction && CharacterLoader.instructionMap.get(instruction);
    if (ins) {
      this.action = ins[0].action;
      this.currentInstructions = ins;
    }
  }

  async update(characterData: CharacterData) {
    const isPlayingChanged = this.isAnimating !== characterData.isAnimating;
    const isStopToPlay = !this.isAnimating && characterData.isAnimating;
    if (!characterData.isAnimating) {
      this.instructionFrame = characterData.frame || 0;
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
      this.renderCharacter();
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
    if (attributes.instruction !== this.#_instruction) {
      hasChange = true;
      this.instruction = attributes.instruction;
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
    await Promise.all(this.bodyFrames.map((frame) => frame?.updateMixDye(id)));
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
  get allEffectPieces() {
    return this.currentAllItem.flatMap((item) => item.allAnimatablePieces);
  }

  getOrCreatZmapLayer(zmap: Zmap, layer: PieceSlot) {
    let container = this.zmapLayers.get(layer);
    if (!container) {
      container = new CharacterZmapContainer(layer, zmap.indexOf(layer), this);
      this.bodyFrame.addChild(container);
      this.zmapLayers.set(layer, container);
    }
    return container;
  }
  getOrCreatEffectLayer(zIndex: number) {
    let container = this.effectLayers.get(zIndex);
    if (!container) {
      container = new Container();
      container.zIndex = zIndex >= 2 ? zIndex + 200 : zIndex - 10;
      this.bodyFrame.addChild(container);
      this.effectLayers.set(zIndex, container);
    }
    return container;
  }

  renderCharacter() {
    const zmap = CharacterLoader?.zmap;
    if (!zmap) {
      return;
    }
    this.reset();
    this.updateActionByWeapon();

    for (const effectPieces of this.allEffectPieces) {
      if (effectPieces.effectZindex === undefined) {
        continue;
      }
      const effectLayer = this.getOrCreatEffectLayer(effectPieces.effectZindex);
      effectLayer.addChild(effectPieces);
      if (this.isAnimating) {
        effectPieces.play();
      } else {
        effectPieces.gotoAndStop(0);
      }
    }

    for (const instruction of this.currentInstructions) {
      const frameKey = `${instruction.action}-${instruction.frame}` as const;
      const bodyFrame = this.bodyFrameMap.get(frameKey);
      if (!bodyFrame) {
        continue;
      }
      bodyFrame.updatePieces();
    }
    if (this.isAnimating) {
      this.isPlaying = true;
      this.nameTag.play();
      this.playByInstructions(this.currentInstructions);
    } else {
      this.playBodyFrame();
    }
    this.isLoading = false;
    this.loadEvent.emit('loaded');
  }

  play(frame = 0) {
    if (this.isPlaying) {
      return;
    }
    this.isAnimating = true;
    this.instructionFrame = frame;
    this.nameTag.play();
    return this.loadItems();
  }
  stop() {
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
    for (const effectContainer of this.effectLayers.values()) {
      effectContainer.removeChildren();
    }
  }

  getInstructionsByBodyAndWeapon(
    action: CharacterAction,
    bodyItem?: CharacterItem,
    weaponItem?: CharacterItem,
  ) {
    const bodyActionItem = bodyItem?.actionPieces.get(
      action,
    ) as CharacterActionItem;
    const weaponActionItem = weaponItem?.actionPieces.get(
      action,
    ) as CharacterActionItem;
    if (!bodyActionItem) {
      return [];
    }

    /* some weapon only have few frame */
    const minFrame = Math.min(
      bodyActionItem.frameCount,
      weaponActionItem?.frameCount ?? bodyActionItem.frameCount,
    );
    const needBounce =
      this.action === CharacterAction.Alert || this.action.startsWith('stand');

    const instructions: WzActionInstruction[] = [];

    for (let frame = 0; frame < minFrame; frame++) {
      const delay = bodyActionItem.wz[frame]?.delay || 100;
      instructions.push({
        action,
        frame,
        delay,
      });
    }
    if (needBounce) {
      for (let frame = minFrame - 2; frame > 0; frame--) {
        const delay = bodyActionItem.wz[frame]?.delay || 100;
        instructions.push({
          action,
          frame,
          delay,
        });
      }
    }

    return instructions;
  }

  playByInstructions(instructions: WzActionInstruction[]) {
    this.currentInstructions = instructions;
    const maxFrame = instructions.length;
    this.playBodyFrame();
    this.currentTicker = (delta) => {
      const currentDuration = instructions[this.instructionFrame]?.delay || 100;
      this.currentDelta += delta.deltaMS;
      if (this.currentDelta > currentDuration) {
        this.currentDelta %= currentDuration;
        if (this.instructionFrame + 1 >= maxFrame) {
          this.instructionFrame = 0;
        } else {
          this.instructionFrame += 1;
        }
        this.playBodyFrame();
      }
    };
    Ticker.shared.add(this.currentTicker);
  }

  playBodyFrame() {
    const instruction = this.currentInstruction;
    if (!instruction || this.destroyed) {
      return;
    }
    const key = `${instruction.action}-${instruction.frame}` as const;
    const bodyFrame = this.bodyFrameMap.get(key);
    bodyFrame?.renderPieces();
    if (instruction.move) {
      this.bodyFrame.position.copyFrom(instruction.move);
    } else {
      this.bodyFrame.position.set(0, 0);
    }
  }

  get currentAction() {
    if (this.instruction && this.currentInstruction?.action) {
      return this.currentInstruction.action;
    }
    return this.action;
  }

  get currentInstruction(): WzActionInstruction | undefined {
    return this.currentInstructions[this.instructionFrame];
  }
  get bodyFrames() {
    return this.currentInstructions.map((instruction) => {
      const frameKey = `${instruction.action}-${instruction.frame}` as const;
      return this.bodyFrameMap.get(frameKey);
    }) as CharacterBodyFrame[];
  }

  get weaponItem() {
    return Array.from(this.idItems.values()).find((item) => item.isWeapon);
  }
  get headItem() {
    return Array.from(this.idItems.values()).find((item) => item.isHead);
  }
  get bodyItem() {
    return Array.from(this.idItems.values()).find((item) => item.isBody);
  }

  async loadInstruction() {
    const bodyItem = this.bodyItem;
    if (bodyItem) {
      await bodyItem.load().catch((_) => undefined);
    }

    const weaponItem = this.weaponItem;
    if (weaponItem) {
      try {
        await weaponItem.load();
        this.updateActionByWeapon();
      } catch (_) {
        // errorItems.push(weaponItem.info);
      }
    }
    // generate animation instruction by body
    if (!this.instruction) {
      this.currentInstructions = this.getInstructionsByBodyAndWeapon(
        this.action,
        bodyItem,
        weaponItem,
      );
    }

    if (!this.isAnimating) {
      this.currentInstructions = this.currentInstructions.slice(0, 1);
    }
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
    }, 50);

    await this.loadInstruction();

    const usedBodyFrame: CharacterBodyFrame[] = [];
    const frameAndActionNeedToLoad: Set<`${CharacterAction}-${number}`> =
      new Set();

    for (const instruction of this.currentInstructions) {
      const frameKey = `${instruction.action}-${instruction.frame}` as const;
      let bodyFrame = this.bodyFrameMap.get(frameKey);
      if (!bodyFrame) {
        bodyFrame = new CharacterBodyFrame(
          this,
          instruction.action,
          instruction.frame,
        );
        frameAndActionNeedToLoad.add(frameKey);
        this.bodyFrameMap.set(frameKey, bodyFrame);
      }
      if (this.isAnimating || usedBodyFrame.length === 0) {
        usedBodyFrame.push(bodyFrame);
      }
    }

    const loadItems = Array.from(this.idItems.values()).map(async (item) => {
      try {
        await item.load();
        if (this.isAnimating) {
          await item.prepareActionAnimatableResource(
            item.isUseExpressionItem ? this.expression : this.action,
          );
        }
      } catch (_) {
        return item.info;
      }
    });

    const errorItems = await Promise.all(loadItems).then((items) =>
      items.filter((item) => item),
    );
    await Promise.all(usedBodyFrame.map((frame) => frame.prepareResourece()));

    if (this.#_renderId !== renderId) {
      return;
    }

    if (errorItems.length > 0) {
      this.loadEvent.emit('error', errorItems);
    }

    const itemCount = this.idItems.size;

    for (const bodyFrame of usedBodyFrame) {
      bodyFrame.clearAncher();
      bodyFrame.updatePieces();
    }

    // try to build ancher but up to 2 times of item count
    for (let i = 0; i < itemCount * 4; i++) {
      if (usedBodyFrame.every((frame) => frame.isAllAncherBuilt)) {
        break;
      }
      for (const bodyFrame of usedBodyFrame) {
        bodyFrame.buildAncher();
      }
    }

    this.buildLock();

    /* initizlize mixdye */
    const mixDyeItems = Array.from(this.idItems.values())
      .filter((item) => isMixDyeableId(item.info.id))
      .map((item) => this.updateMixDye(item.info.id, item.info));

    await Promise.all(mixDyeItems);

    this.renderCharacter();
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

  toggleEffectVisibility(isHide?: boolean) {
    this.isHideAllEffect = isHide ?? !this.isHideAllEffect;
    for (const layer of this.effectLayers.values()) {
      layer.visible = !this.isHideAllEffect;
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
    } else if (this.#_handType === CharacterHandType.Gun) {
      if (this.action === CharacterAction.Walk2) {
        this.#_action = CharacterAction.Walk1;
      } else if (this.action === CharacterAction.Stand2) {
        this.#_action = CharacterAction.Stand1;
      }
    }
  }
  private updateActionByWeapon() {
    const weaponItem = this.weaponItem;
    if (!weaponItem) {
      return;
    }
    const hasStand1 = weaponItem.actionPieces.has(CharacterAction.Stand1);
    const hasStand2 = weaponItem.actionPieces.has(CharacterAction.Stand2);
    const hasWalk1 = weaponItem.actionPieces.has(CharacterAction.Walk1);
    const hasWalk2 = weaponItem.actionPieces.has(CharacterAction.Walk2);

    // that not consider the case of not have both stand1 and stand2
    if (this.action === CharacterAction.Stand1 && !hasStand1) {
      this.action = CharacterAction.Stand2;
    } else if (this.action === CharacterAction.Stand2 && !hasStand2) {
      this.action = CharacterAction.Stand1;
    } else if (this.action === CharacterAction.Walk1 && !hasWalk1) {
      this.action = CharacterAction.Walk2;
    } else if (this.action === CharacterAction.Walk2 && !hasWalk2) {
      this.action = CharacterAction.Walk1;
    }
  }
  destroy(options?: DestroyOptions) {
    this.reset();
    super.destroy(options);
    this.loadEvent.removeAllListeners();
    this.zmapLayers.clear();
    this.locks.clear();
    for (const item of this.idItems.values()) {
      item.destroy();
    }
    this.idItems.clear();
    this.bodyFrameMap.clear();
    this.currentInstructions = [];
  }
}
