import type { Vec2 } from './const/data';
import type {
  WzChairData,
  WzChairGroupData,
  WzChairLvData,
  WzChairCustomInfo,
  WzChairCustomMovingInfo,
  WzChairAndroidData,
} from './const/wz';
import { CharacterAction } from '@/const/actions';
import {
  type CharacterExpressions,
  CharacterExpressionsOrder,
} from '@/const/emotions';

export interface ChairGroupData {
  flip: boolean;
  position: Vec2;
  hideBody: boolean;
  action: CharacterAction;
  tamingMobId?: number;
  expression?: CharacterExpressions;
  z?: number;
}

export function generateChairGroupData(data: WzChairData): ChairGroupData[] {
  const groupDataList: ChairGroupData[] = [];

  groupDataList.push(getFirstCharacterGroupData(data));

  if (data.info.group) {
    groupDataList.pop();
    groupDataList.push(...getGroupDataFromGroup(data.info.group));
  } else if (data.info.lvChairInfo) {
    const lvGroups = getGroupDataFromLvChair(data.info.lvChairInfo);
    if (lvGroups.length > 0) {
      // data.info.lvChairInfo.zeroAloneCheck && groupDataList.pop();
      groupDataList.push(...lvGroups);
    }
  } else if (data.info.customChair?.androidChairInfo) {
    groupDataList.push(
      getGroupDataFromAndroidData(
        data.info.customChair.androidChairInfo,
        groupDataList[0],
      ),
    );
  } else if (data.info.customChair) {
    groupDataList.push(...getGroupDataFromCustom(data.info.customChair));
  }

  return groupDataList;
}

export function getFirstCharacterGroupData(data: WzChairData) {
  const groupData: ChairGroupData = {
    flip: false,
    position: { x: 0, y: 0 },
    hideBody: false,
    action: CharacterAction.Sit,
  };
  if (data.info.customChair?.self) {
    const selfMoveData = data.info.customChair.self;
    const gd = getGroupDataFromCustomMoving(selfMoveData);
    groupData.flip = gd.flip;
    groupData.position = gd.position;
    groupData.z = gd.z;
    groupData.tamingMobId = gd.tamingMobId;
  }
  if (data.info.sitRight && data.info.sitRight === 1) {
    // groupData.flip = true;
  }
  if (data.info.removeBody) {
    groupData.hideBody = true;
  }
  if (data.info.sitAction) {
    const action = data.info.sitAction;
    groupData.action =
      (action as unknown as string) === 'hide' ? CharacterAction.Sit : action;
  }
  if (data.info.sitEmotion) {
    const emotion = data.info.sitEmotion;
    if (typeof emotion === 'number') {
      groupData.expression =
        CharacterExpressionsOrder[emotion as unknown as number];
    } else {
      groupData.expression = emotion;
    }
  }
  if (data.info.tamingMob) {
    groupData.tamingMobId = data.info.tamingMob;
  }
  // when a chair have tamingMobId on it, don't use bodyRelMove
  if (
    !data.info.tamingMob &&
    (data.info.bodyRelMove || data.info.floatingBodyRelMove)
  ) {
    const pos = data.info.bodyRelMove ||
      data.info.floatingBodyRelMove || { x: 0, y: 0 };
    groupData.position = { ...pos };
  }
  if (groupData.flip) {
    // groupData.position.x *= -1;
  }

  return groupData;
}

export function getGroupDataFromCustom(data: WzChairCustomInfo) {
  const groupDataList: ChairGroupData[] = [];
  if (!data.avatar) {
    return groupDataList;
  }

  const avatarCount = data.avatarCount || 1;

  for (let i = 0; i < avatarCount; i++) {
    groupDataList.push(getGroupDataFromCustomMoving(data.avatar[i]));
  }

  return groupDataList;
}

export function getGroupDataFromGroup(data: WzChairGroupData) {
  const groupDataList: ChairGroupData[] = [];
  let start = 0;
  while (data.sit[start]) {
    const sitData = data.sit[start];
    groupDataList.push({
      action: sitData.sitAction || CharacterAction.Sit,
      flip: sitData.dir === 0,
      position: {
        x: /* sitData.bodyRelMove?.x ||  */ 0,
        y: /* sitData.bodyRelMove?.y ||  */ 0,
      },
      hideBody: false,
      tamingMobId: sitData.tamingMobM || sitData.tamingMobF,
    });
    start += 1;
  }

  return groupDataList;
}

export function getGroupDataFromLvChair(data: WzChairLvData) {
  const groupDataList: ChairGroupData[] = [];
  const avatarCount = data.avatarCount || 0;
  const gap = data.avatarGap || 0;
  const startPos = data.startPos || data.avatarStartPos || { x: 0, y: 0 };

  for (let i = 0; i < avatarCount; i++) {
    const baseData: ChairGroupData = {
      // the lv chair's default action seems to be stand1 not sit
      action: CharacterAction.Stand1,
      flip: false,
      position: { x: 0, y: 0 },
      hideBody: false,
    };
    const pos = {
      x: startPos.x + i * gap,
      y: startPos.y,
    };
    if (data.avatarPos?.[i]) {
      pos.x = data.avatarPos[i].x;
      pos.y = data.avatarPos[i].y;
    }
    if (data.avatarLeft?.[i] === -1) {
      baseData.flip = true;
    }
    if (data.sitAction?.[i]) {
      const action = data.sitAction[i];
      baseData.action =
        (action as unknown as string) === 'stand'
          ? CharacterAction.Stand1
          : action;
    }
    /* force properties check */
    const forceHideBody = data[
      `forcedHideBody${i}` as keyof typeof data
    ] as number;
    const forceAction = data[
      `forcedAction${i}` as keyof typeof data
    ] as CharacterAction;
    const forceLeft = data[`forcedLeft${i}` as keyof typeof data] as number;
    const forcePos = data[`forcedPos${i}` as keyof typeof data] as Vec2;
    if (forceHideBody === 1) {
      baseData.hideBody = true;
    }
    if (forceAction) {
      baseData.action = forceAction;
    }
    if (forceLeft === 0) {
      baseData.flip = true;
    }
    if (forcePos) {
      pos.x = forcePos.x;
      pos.y = forcePos.y;
    }
    baseData.position = pos;

    groupDataList.push(baseData);
  }

  return groupDataList;
}

function getGroupDataFromCustomMoving(data: WzChairCustomMovingInfo) {
  return {
    action: CharacterAction.Sit,
    flip: data.left !== -1,
    position: data.pos,
    tamingMobId: data.tamingMob,
    z: data.z,
  } as ChairGroupData;
}

function getGroupDataFromAndroidData(
  data: WzChairAndroidData,
  firstData: ChairGroupData,
) {
  return {
    action: data.forcedAction || CharacterAction.Sit,
    flip: data.reverseFlip === 1 ? !firstData.flip : firstData.flip,
    position: {
      x: (data.pos?.x || 0) * (firstData.flip === true ? -1 : 1),
      y: data.pos?.y || 0,
    },
    hideBody: data.forcedHideBody === 1,
  } as ChairGroupData;
}
