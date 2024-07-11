export const AllCategory = 'All';

export enum EquipCategory {
  Cap = '1',
  Cape = '2',
  Coat = '3',
  Dragon = '4', // Evan's Dragon Equip
  Mechanic = '5', // Mechanic's Equip
  Face = '6',
  Glove = '7',
  Hair = '8',
  Longcoat = '9',
  Pants = '10',
  PetEquip = '11',
  Ring = '12',
  Shield = '13',
  Shoes = '14',
  Taming = '15', // Taming Mob
  Weapon = '16',
  Android = '17',
  Accessory = '18',
  Bit = '19', // More Like Puzzle Pieces
  ArcaneForce = '20',
  AuthenticForce = '21',
  Skin = '22',
  SkillSkin = '23',
  Unknown = '24',
}

const ValidEquipSubCategory = [
  'Skin',
  'Head',
  'Body',
  'Cap',
  'Hat',
  'Cape',
  'Coat',
  'Dragon',
  'Mechanic',
  'Face',
  'Glove',
  'Hair',
  'Longcoat',
  'Overall',
  'Pants',
  'Shield',
  'Shoes',
  'Weapon',
  'CashWeapon',
  'Face Accessory',
  'Eye Decoration',
  'Earrings',
];

export type EquipSubCategory =
  | 'Skin'
  | 'Head'
  | 'Body'
  | 'Cap'
  | 'Hat'
  | 'Cape'
  | 'Coat'
  // 'Dragon' |
  // 'Mechanic' |
  | 'Face'
  | 'Glove'
  | 'Hair'
  | 'Longcoat'
  | 'Overall'
  | 'Pants'
  // 'PetEquip' |
  // 'Ring' |
  | 'Shield'
  | 'Shoes'
  // 'Taming' |
  | 'Weapon'
  | 'CashWeapon'
  // 'Android' |
  // 'Bit' |
  // 'ArcaneForce' |
  // 'AuthenticForce' |
  // 'Skin' |
  // 'SkillSkin' |
  // 'Unknown' |
  | 'Face Accessory'
  | 'Eye Decoration'
  | 'Earrings';

export type UnavailableEquipCategory =
  | EquipCategory.Dragon
  | EquipCategory.Mechanic
  | EquipCategory.PetEquip
  | EquipCategory.Ring
  | EquipCategory.Taming
  | EquipCategory.Android
  | EquipCategory.Bit
  | EquipCategory.ArcaneForce
  | EquipCategory.AuthenticForce
  | EquipCategory.Skin
  | EquipCategory.SkillSkin
  | EquipCategory.Unknown;
export type AvaialbeEquipCategory = Exclude<
  EquipCategory,
  UnavailableEquipCategory
>;

export function isValidEquipSubCategory(
  category: string,
): category is EquipSubCategory {
  return ValidEquipSubCategory.includes(category as EquipCategory);
}
