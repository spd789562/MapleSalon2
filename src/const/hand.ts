export enum CharacterHandType {
  SingleHand = 'singleHand',
  DoubleHand = 'doubleHand',
}

export function isValidHandType(value: string): value is CharacterHandType {
  return Object.values(CharacterHandType).includes(value as CharacterHandType);
}
