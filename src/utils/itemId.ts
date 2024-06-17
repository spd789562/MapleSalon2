import { $apiHost } from '@/store/const';
import { getItemFolderFromId } from './itemFolder';
import type { EquipSubCategory } from '@/const/equipments';

export enum Gender {
  Male = 0,
  Female = 1,
  Share = 2,
}

export function isBodyId(id: number): boolean {
  return Math.floor(id / 2000) === 1;
}

export function isHeadId(id: number): boolean {
  return Math.floor(id / 12000) === 1;
}

export function isFaceId(id: number): boolean {
  return (id >= 20000 && id < 30000) || (id >= 50000 && id < 60000);
}

export function isHairId(id: number): boolean {
  return (id >= 30000 && id < 50000) || (id >= 60000 && id < 70000);
}

export function isCapId(id: number): boolean {
  return Math.floor(id / 10000) === 100;
}

export function isFaceAccessoryId(id: number): boolean {
  return Math.floor(id / 10000) === 101;
}

export function isEyeAccessoryId(id: number): boolean {
  return Math.floor(id / 10000) === 103;
}

export function isEarAccessoryId(id: number): boolean {
  return Math.floor(id / 10000) === 103;
}

export function isCoatId(id: number): boolean {
  return Math.floor(id / 10000) === 104;
}

export function isLongcoatId(id: number): boolean {
  return Math.floor(id / 10000) === 105;
}

export function isPantsId(id: number): boolean {
  return Math.floor(id / 10000) === 106;
}

export function isShoesId(id: number): boolean {
  return Math.floor(id / 10000) === 107;
}

export function isGloveId(id: number): boolean {
  return Math.floor(id / 10000) === 108;
}

export function isShieldId(id: number): boolean {
  return Math.floor(id / 10000) === 109;
}

export function isCapeId(id: number): boolean {
  return Math.floor(id / 10000) === 110;
}

export function isWeaponId(id: number): boolean {
  const shortId = Math.floor(id / 10000);
  return shortId >= 121 && shortId <= 160;
}

export function isCashWeaponId(id: number): boolean {
  return Math.floor(id / 10000) === 170;
}

export function getGender(id: number): Gender {
  const tag = (id / 1000) % 10;
  switch (tag) {
    case 0:
    case 3:
    case 5:
    case 6: {
      return Gender.Male;
    }
    case 1:
    case 4:
    case 7:
    case 8: {
      return Gender.Female;
    }
    default:
      return Gender.Share;
  }
}

export function getSubCategory(id: number): EquipSubCategory | null {
  if (isBodyId(id)) {
    return 'Body';
  }
  if (isHeadId(id)) {
    return 'Head';
  }

  const partOfId = Math.floor(id / 10000);

  switch (partOfId) {
    case 2:
    case 5:
      return 'Face';
    case 3:
    case 4:
    case 6:
      return 'Hair';
    case 100:
      return 'Cap';
    case 101:
      return 'Face Accessory';
    case 102:
      return 'Eye Decoration';
    case 103:
      return 'Earrings';
    case 105:
      return 'Overall';
    case 106:
      return 'Pants';
    case 107:
      return 'Shoes';
    case 108:
      return 'Glove';
    case 109:
      return 'Shield';
    case 110:
      return 'Cape';
    case 170:
      return 'CashWeapon';
  }

  if (partOfId >= 121 && partOfId < 170) {
    return 'Weapon';
  }

  return null;
}

export function replaceIdInPath(path: string, id: number): string {
  return path.replace(/\d{8}/, String(id).padStart(8, '0'));
}

export function getIconPath(id: number, folder?: string) {
  let getfolder = folder;
  if (!folder) {
    getfolder = getItemFolderFromId(id);
  }
  let iconPath = 'info/icon';
  if (getfolder === 'Face/') {
    iconPath = 'blink/0/face';
  } else if (getfolder === 'Hair/') {
    iconPath = 'default/hair';
  } else if (getfolder === '') {
    if (isBodyId(id)) {
      iconPath = 'stand1/0/body';
    } else if (isHeadId(id)) {
      iconPath = 'front/head';
    }
  }
  return `${$apiHost.get()}/node/image_unparsed/Character/${getfolder}${id
    .toString()
    .padStart(8, '0')}.img/${iconPath}`;
}
