export enum CharacterHandType {
  SingleHand = 'singleHand',
  DoubleHand = 'doubleHand',
  Gun = 'gun',
}

export function isValidHandType(value: string): value is CharacterHandType {
  return Object.values(CharacterHandType).includes(value as CharacterHandType);
}
