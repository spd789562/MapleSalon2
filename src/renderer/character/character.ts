import { createUniqueId } from 'solid-js';
import {
  Container,
  Ticker,
  EventEmitter,
  Graphics,
  type DestroyOptions,
} from 'pixi.js';

import { getEquipById } from '@/store/string';

import type { CharacterData } from '@/store/character/store';
import type { ItemInfo, PieceSlot, Vec2, Zmap } from './const/data';
import type { PieceIslot } from './const/slot';
import type { WzActionInstruction } from './const/wz';
import type { CategorizedItem, CharacterActionItem } from './categorizedItem';
import { CharacterLoader } from './loader';
import { CharacterItem } from './item';
import { CharacterBodyFrame } from './characterBodyFrame';
import { CharacterFaceFrame } from './characterFaceFrame';
import { CharacterZmapContainer } from './characterZmapContainer';

import { isMixDyeableId, isFaceId } from '@/utils/itemId';

import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterEarType } from '@/const/ears';
import { CharacterHandType } from '@/const/hand';
import { CharacterExtraPartIdMap } from '@/const/extraParts';
import { BaseNameTag } from '../nameTag/baseNameTag';
import { ChatBalloon } from '../chatBalloon/chatBalloon';
import { BaseMedal } from '../medal/baseMedal';
// import { NickTag } from '../nickTag/nickTag';
import { Skill } from '../skill/skill';

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
  type = 'character';

  name = '';
  nameTag: BaseNameTag;
  chatBalloon: ChatBalloon;
  medal?: BaseMedal;
  nickTag?: BaseMedal;
  skill?: Skill;
  idItems = new Map<number, CharacterItem>();

  #_action = CharacterAction.Jump;
  /* action of actually display */
  #_useAction = CharacterAction.Jump;
  #_instruction?: string;
  #_expression: CharacterExpressions = CharacterExpressions.Default;
  /* expression of actually display */
  #_useExpression = CharacterExpressions.Default;
  #_earType = CharacterEarType.HumanEar;
  #_handType = CharacterHandType.DoubleHand;
  #_speed = 1;
  #_renderId = '';
  flip = false;
  forceFlip = false;
  forceScale = 1;

  zmapLayers = new Map<PieceSlot, CharacterZmapContainer>();
  effectLayers = new Map<number, Container>();
  bodyContainer = new Container();
  bodyFrame = new Container();
  backSkillContainer = new Container();
  frontSkillContainer = new Container();
  locks = new Map<PieceSlot, number>();
  offset: Vec2 = { x: 0, y: 0 };

  frame = 0;
  _instructionFrame = 0;
  currentInstructions: WzActionInstruction[] = [];
  customInstructions: WzActionInstruction[] = [];
  bodyFrameMap = new Map<`${CharacterAction}-${number}`, CharacterBodyFrame>();
  faceFrameMap = new Map<
    `${CharacterExpressions}-${number}`,
    CharacterFaceFrame
  >();

  isPlaying = false;
  isAnimating = false;

  isHideBody = false;
  isHideAllEffect = false;
  isWaitToLoadTamingMob = false;

  /* delta to calculate is need enter next frame */
  currentDelta = 0;
  currentTicker?: (delta: Ticker) => void;

  isLoading = false;
  loadFlashTimer = 0;
  loadEvent = new EventEmitter<'loading' | 'loaded' | 'error'>();

  constructor() {
    super();
    this.sortableChildren = true;
    this.bodyFrame.sortableChildren = true;
    this.nameTag = new BaseNameTag('');
    this.nameTag.visible = false;
    this.nameTag.position.set(0, 3);
    this.nameTag.zIndex = 1;
    this.bodyContainer.zIndex = 0;
    this.chatBalloon = new ChatBalloon('default: Hello');
    this.chatBalloon.visible = false;
    this.chatBalloon.position.set(-10, -60);
    this.chatBalloon.zIndex = 2;
    this.backSkillContainer.zIndex = -1;
    this.frontSkillContainer.zIndex = 3;
    this.bodyContainer.addChild(this.bodyFrame);
    this.addChild(this.backSkillContainer);
    this.addChild(this.bodyContainer);
    this.addChild(this.nameTag);
    this.addChild(this.chatBalloon);
    this.addChild(this.frontSkillContainer);
  }

  get action() {
    return this.#_action;
  }
  get useAction() {
    return this.#_useAction;
  }
  get expression() {
    return this.#_expression;
  }
  get useExpression() {
    return this.#_useExpression;
  }
  get earType() {
    return this.#_earType;
  }
  get handType() {
    return this.#_handType;
  }
  set action(action: CharacterAction) {
    this.#_action = action;
    this.#_useAction = action;
  }
  set useAction(action: CharacterAction) {
    this.#_useAction = action;
  }
  set expression(expression: CharacterExpressions) {
    this.#_expression = expression;
  }
  set useExpression(expression: CharacterExpressions) {
    this.#_useExpression = expression;
  }
  set earType(earType: CharacterEarType) {
    this.#_earType = earType;
  }
  set handType(handType: CharacterHandType) {
    this.#_handType = handType;

    this.updateActionByHandType();
  }
  get speed() {
    return this.#_speed;
  }
  set speed(speed: number) {
    this.#_speed = speed;
    if (this.skill) {
      this.skill.speed = speed;
    }
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
      this.useAction = ins[0].action;
      this.currentInstructions = ins;
    }
  }

  async update(characterData: CharacterData) {
    const isPlayingChanged = this.isAnimating !== characterData.isAnimating;
    const isStopToPlay = !this.isAnimating && characterData.isAnimating;
    let frameChanged = false;
    if (!characterData.isAnimating) {
      if (this.instructionFrame !== characterData.frame) {
        frameChanged = true;
        this.instructionFrame = characterData.frame || 0;
      }
      this.stop();
    }
    this.isAnimating = characterData.isAnimating;
    const renderId = this.startLoad();
    const hasSkillChanged = await this.updateSkill(characterData);
    const hasAttributeChanged = this.updateAttribute(characterData);
    const hasAddAnyItem = await this.updateItems(
      Object.values(characterData.items).concat(
        (characterData.extraParts || []).map(
          (part) =>
            ({
              id: CharacterExtraPartIdMap[part],
              enableEffect: true,
            }) as ItemInfo,
        ),
      ),
    );

    if (characterData.showNameTag) {
      await this.nameTag.updateNameTagData(
        characterData.name || '',
        characterData.nameTagId,
      );
      this.name = characterData.name || '';
      this.nameTag.visible = true;
    } else {
      this.nameTag.visible = false;
    }
    if (characterData.showChatBalloon) {
      await this.chatBalloon.updateChatBalloonData(characterData.chatBalloonId);
      this.chatBalloon.visible = true;
    } else {
      this.chatBalloon.visible = false;
    }
    if (characterData.medalId !== this.medal?.id) {
      await this.updateMedal(characterData.medalId);
    }
    if (characterData.nickTagId !== this.nickTag?.id) {
      await this.updateNickTag(characterData.nickTagId);
    }

    if (
      hasAttributeChanged ||
      hasAddAnyItem ||
      hasSkillChanged ||
      isStopToPlay ||
      (!this.isAnimating && frameChanged) ||
      this.customInstructions.length > 0
    ) {
      await this.loadItems(renderId);
    } else if (isPlayingChanged) {
      this.renderCharacter();
    } else {
      this.isLoading = false;
      this.loadEvent.emit('loaded');
    }
  }

  async updateMedal(id?: number) {
    if (this.medal) {
      this.medal && this.removeChild(this.medal);
      this.medal?.destroy({
        children: true,
      });
    }
    if (!id) {
      this.medal = undefined;
      return;
    }
    const data = getEquipById(id);
    if (data) {
      this.medal = new BaseMedal(data.name, id);
      this.medal.position.set(0, 30);
      this.medal.zIndex = 2;
      await this.medal.load();
      this.addChild(this.medal);
    }
  }
  async updateNickTag(id?: number) {
    if (this.nickTag) {
      this.nickTag && this.removeChild(this.nickTag);
      this.nickTag?.destroy({
        children: true,
      });
    }
    if (!id) {
      this.nickTag = undefined;
      return;
    }
    const data = getEquipById(id);
    if (data) {
      this.nickTag = new BaseMedal(data.name, id, 'nickTag');
      this.nickTag.position.set(0, -110);
      this.nickTag.zIndex = 2;
      await this.nickTag.load();
      this.addChild(this.nickTag);
    }
  }

  updateAttribute(attributes: Partial<CharacterAttributes>) {
    let hasChange = false;
    if (attributes.action) {
      const action = this.getActionByHandType(
        attributes.handType ?? CharacterHandType.SingleHand,
        attributes.action,
      );
      if (action !== this.#_action) {
        hasChange = true;
        this.action = action;
      }
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
  async updateSkill(characterData: CharacterData) {
    const skillId = characterData.skillId;
    if (this.skill && !skillId) {
      this.skill.destroy();
      this.skill = undefined;
      characterData.instruction = undefined;
      this.bodyFrame.position.set(0, 0);
      return true;
    }
    if (!skillId) {
      return false;
    }
    if (this.skill?.id === skillId) {
      const instruction = this.skill.isNormalAction
        ? undefined
        : this.skill.action;
      const action = (
        this.skill.isNormalAction ? this.skill.action : characterData.action
      ) as CharacterAction;
      characterData.action = action;
      characterData.instruction = instruction;
      this.bodyFrame.position.set(0, 0);
      return false;
    }
    this.skill?.destroy();
    const skill = new Skill(skillId, this.speed);
    skill.character = this;
    await skill.load();
    const instruction = skill.isNormalAction ? undefined : skill.action;
    const action = (
      skill.isNormalAction ? skill.action : characterData.action
    ) as CharacterAction;
    characterData.action = action;
    characterData.instruction = instruction;
    this.bodyFrame.position.set(0, 0);
    this.skill = skill;
    return true;
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
    if (isFaceId(id)) {
      await Promise.all(
        this.faceFrames.map((frame) => frame?.updateMixDye(id)),
      );
    } else {
      await Promise.all(
        this.bodyFrames.map((frame) => frame?.updateMixDye(id)),
      );
    }
  }

  /** get current items filter by expression and action */
  get currentAllItem() {
    return Array.from(this.idItems.values())
      .map((item) => {
        return item.isUseExpressionItem
          ? item.actionPieces.get(this.useExpression)
          : item.actionPieces.get(this.useAction);
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
  playEffect() {
    for (const effectPieces of this.allEffectPieces) {
      if (effectPieces.effectZindex === undefined) {
        continue;
      }
      effectPieces.play();
    }
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
    this.nickTag?.stop();
    this.medal?.stop();
  }
  stopEffect() {
    for (const effectPieces of this.allEffectPieces) {
      if (effectPieces.effectZindex === undefined) {
        continue;
      }
      effectPieces.gotoAndStop(0);
    }
  }
  reset() {
    this.stop();
    for (const effectContainer of this.effectLayers.values()) {
      effectContainer.removeChildren();
    }
  }
  resetDelta() {
    this.instructionFrame = 0;
    this.currentDelta = 0;
    /* reset effects frame */
    for (const effect of this.allEffectPieces) {
      effect.currentFrame = 0;
      /* @ts-ignore */
      effect._currentTime = 0;
    }
  }

  getInstructionsByBodyAndWeapon(
    bodyItem?: CharacterItem,
    weaponItem?: CharacterItem,
  ) {
    const bodyActionItem = bodyItem?.actionPieces.get(
      this.action,
    ) as CharacterActionItem;
    const weaponActionItem = weaponItem?.actionPieces.get(
      this.action,
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
        action: this.action,
        frame,
        delay,
      });
    }
    if (needBounce) {
      for (let frame = minFrame - 2; frame > 0; frame--) {
        const delay = bodyActionItem.wz[frame]?.delay || 100;
        instructions.push({
          action: this.action,
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
    this.skill?.play();
    this.currentTicker = (delta) => {
      if (this.destroyed) {
        return;
      }
      const currentDuration = instructions[this.instructionFrame]?.delay || 100;
      this.currentDelta += delta.deltaMS * this.speed;
      if (this.currentDelta > currentDuration) {
        this.currentDelta %= currentDuration;
        if (this.instructionFrame + 1 >= maxFrame) {
          if (!this.skill?.isPlaying) {
            this.instructionFrame = 0;
            this.bodyFrame.position.set(0, 0);
            this.skill?.play();
          }
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
    this.updateFlip(instruction.flip === 1);
    const bodyFrame = this.getBodyFrameByInstruction(instruction);
    const faceFrame = this.getFaceFrameByInstruction(instruction);
    bodyFrame?.renderPieces();
    faceFrame?.renderPieces(bodyFrame);
    if (instruction.move) {
      const move = {
        x: instruction.move.x /*  + this.offset.x */,
        y: instruction.move.y /*  + this.offset.y */,
      };
      this.bodyFrame.position.copyFrom(move);
    }
    if (this.forceScale) {
      this.bodyContainer.scale.x = this.forceScale * (this.flip ? -1 : 1);
      this.bodyContainer.scale.y = this.forceScale;
    }
  }
  get currentAction() {
    if (this.instruction && this.currentInstruction?.action) {
      return this.currentInstruction.action;
    }
    return this.useAction;
  }

  get currentInstruction(): WzActionInstruction | undefined {
    return this.currentInstructions[this.instructionFrame];
  }
  get bodyFrames() {
    return this.currentInstructions.map((ins) =>
      this.getBodyFrameByInstruction(ins),
    ) as CharacterBodyFrame[];
  }
  get faceFrames() {
    return this.currentInstructions.map((ins) =>
      this.getFaceFrameByInstruction(ins),
    ) as CharacterFaceFrame[];
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
  startLoad() {
    const renderId = createUniqueId();
    this.#_renderId = renderId;

    if (this.isLoading) {
      clearTimeout(this.loadFlashTimer);
      this.loadEvent.emit('loading');
    }

    this.isLoading = true;
    // only show loading after 500ms
    this.loadFlashTimer = setTimeout(() => {
      if (this.isLoading) {
        this.loadEvent.emit('loading');
      }
    }, 500);
    return renderId;
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
    if (this.customInstructions.length > 0) {
      this.currentInstructions = this.customInstructions;
      return;
    }

    // generate animation instruction by body
    if (!this.instruction) {
      this.currentInstructions = this.getInstructionsByBodyAndWeapon(
        bodyItem,
        weaponItem,
      );
    }

    // if (!this.isAnimating) {
    //   this.currentInstructions = this.currentInstructions.slice(
    //     this.instructionFrame,
    //     this.instructionFrame + 1,
    //   );
    // }
  }

  async loadItems(renderId?: string) {
    await this.loadInstruction();

    const usedBodyFrame = this.createBodyFramesWhenNotExist();
    const usedFaceFrame = this.createFaceFramesWhenNotExist();

    const loadItems = Array.from(this.idItems.values()).map(async (item) => {
      try {
        await item.load();
        if (this.isAnimating) {
          await item.prepareActionAnimatableResource(
            item.isUseExpressionItem ? this.expression : this.useAction,
          );
        }
      } catch (_) {
        return item.info;
      }
    });

    const errorItems = await Promise.all(loadItems).then((items) =>
      items.filter((item) => item),
    );
    await Promise.all(
      ([] as Promise<void>[])
        .concat(usedBodyFrame.map((frame) => frame.prepareResourece()))
        .concat(usedFaceFrame.map((frame) => frame.prepareResourece())),
    );

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
    for (const faceFrame of usedFaceFrame) {
      faceFrame.clearAncher();
      faceFrame.updatePieces();
    }

    // try to build ancher but up to 2 times of item count
    for (let i = 0; i < itemCount * 4; i++) {
      if (
        usedBodyFrame.every((frame) => frame.isAllAncherBuilt) &&
        usedFaceFrame.every((frame) => frame.isAllAncherBuilt)
      ) {
        break;
      }
      for (const bodyFrame of usedBodyFrame) {
        bodyFrame.buildAncher();
      }
      for (const faceFrame of usedFaceFrame) {
        faceFrame.buildAncher();
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

  getBodyFrameByInstruction(instruction: WzActionInstruction) {
    const key = `${instruction.action}-${instruction.frame}` as const;
    return this.bodyFrameMap.get(key);
  }
  getFaceFrameByInstruction(instruction: WzActionInstruction) {
    const expression = instruction.expression || this.expression;
    const frame = instruction.expressionFrame || 0;
    const key = `${expression}-${frame}` as const;
    return this.faceFrameMap.get(key);
  }
  createBodyFramesWhenNotExist() {
    const set = new Set<CharacterBodyFrame>();
    let i = 0;
    for (const instruction of this.currentInstructions) {
      const action =
        (instruction.action as unknown as string) === 'hideBody'
          ? CharacterAction.Sit
          : instruction.action;
      const frameKey = `${action}-${instruction.frame}` as const;
      let bodyFrame = this.bodyFrameMap.get(frameKey);
      if (!bodyFrame) {
        bodyFrame = new CharacterBodyFrame(this, action, instruction.frame);
        this.bodyFrameMap.set(frameKey, bodyFrame);
      }
      if (
        this.isAnimating ||
        (!this.isAnimating && this.instructionFrame === i) ||
        this.customInstructions.length > 0
      ) {
        set.add(bodyFrame);
      }
      i += 1;
    }

    return Array.from(set);
  }
  createFaceFramesWhenNotExist() {
    const set = new Set<CharacterFaceFrame>();
    for (const instruction of this.currentInstructions) {
      const expression = instruction.expression || this.expression;
      const frame = instruction.expressionFrame || 0;
      const key = `${expression}-${frame}` as const;
      let faceFrame = this.faceFrameMap.get(key);
      if (!faceFrame) {
        faceFrame = new CharacterFaceFrame(this, expression, frame);
        this.faceFrameMap.set(key, faceFrame);
      }
      if (
        this.isAnimating ||
        set.size === 0 ||
        this.customInstructions.length > 0
      ) {
        set.add(faceFrame);
      }
    }
    return Array.from(set);
  }

  updateFlip(flip: boolean) {
    const actualFlip = this.forceFlip === true ? true : flip;
    if (this.flip === actualFlip) {
      return;
    }
    this.flip = actualFlip;
  }

  private getActionByHandType(
    handType: CharacterHandType,
    action: CharacterAction,
  ) {
    if (handType === CharacterHandType.SingleHand) {
      if (action === CharacterAction.Walk2) {
        return CharacterAction.Walk1;
      }
      if (action === CharacterAction.Stand2) {
        return CharacterAction.Stand1;
      }
    } else if (handType === CharacterHandType.DoubleHand) {
      if (action === CharacterAction.Walk1) {
        return CharacterAction.Walk2;
      }
      if (action === CharacterAction.Stand1) {
        return CharacterAction.Stand2;
      }
    } else if (handType === CharacterHandType.Gun) {
      if (action === CharacterAction.Walk2) {
        return CharacterAction.Walk1;
      }
      if (action === CharacterAction.Stand2) {
        return CharacterAction.Stand1;
      }
    }
    return action;
  }
  private updateActionByHandType() {
    const action = this.getActionByHandType(this.#_handType, this.action);

    if (this.#_action === action) {
      return;
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
    clearTimeout(this.loadFlashTimer);
    this.idItems.clear();
    this.bodyFrameMap.clear();
    this.currentInstructions = [];
  }
}
