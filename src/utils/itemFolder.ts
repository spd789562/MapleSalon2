/**
 * @reference https://github.com/Elem8100/MapleNecrocer/blob/master/MapleNecrocer/Client/MapleCharacter.cs#L43
 */
export function getItemFolderFromId(id: number): string {
  const partOfId = Math.floor(id / 10000);

  switch (partOfId) {
    /* for body and head liek 2000(body), 12000(2000's head) */
    case 0:
    case 1:
      return '';
    case 2:
    case 5:
      return 'Face/';
    case 3:
    case 4:
    case 6:
      return 'Hair/';
    case 100:
      return 'Cap/';
    case 101:
    case 102:
    case 103:
      return 'Accessory/';
    case 104:
      return 'Coat/';
    case 105:
      return 'Longcoat/';
    case 106:
      return 'Pants/';
    case 107:
      return 'Shoes/';
    case 108:
      return 'Glove/';
    case 109:
      return 'Shield/';
    case 110:
      return 'Cape/';
    case 111:
      return 'Ring/';
    case 120:
      return 'Totem/';
    default: {
      if (partOfId >= 112 && partOfId <= 119) {
        return 'Accessory/';
      }
      if (partOfId >= 121 && partOfId <= 170) {
        return 'Weapon/';
      }
      if (partOfId >= 190 && partOfId <= 199) {
        return 'TamingMob/';
      }
      return '';
    }
  }
}
