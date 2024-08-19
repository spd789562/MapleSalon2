export enum CharacterEarType {
  Ear = 'ear',
  HumanEar = 'humanEar',
  LefEar = 'lefEar',
  HighLefEar = 'highlefEar',
}

export function isValidEarType(type: string): type is CharacterEarType {
  return Object.values(CharacterEarType).includes(type as CharacterEarType);
}
