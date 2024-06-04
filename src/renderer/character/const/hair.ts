export enum HairColor {
  Black = '0',
  Red = '1',
  Orange = '2',
  Yellow = '3',
  Green = '4',
  Blue = '5',
  Purple = '6',
  Brown = '7',
}

export type HairColorId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const HairColorHex = {
  [HairColor.Black]: '#444444',
  [HairColor.Red]: '#ff5959',
  [HairColor.Orange]: '#ffb963',
  [HairColor.Yellow]: '#f5e239',
  [HairColor.Green]: '#a0d893',
  [HairColor.Blue]: '#93b7d8',
  [HairColor.Purple]: '#b393d8',
  [HairColor.Brown]: '#876b4e',
};

export const HairColorText = {
  [HairColor.Black]: 'black',
  [HairColor.Red]: 'red',
  [HairColor.Orange]: 'orange',
  [HairColor.Yellow]: 'yellow',
  [HairColor.Green]: 'green',
  [HairColor.Blue]: 'blue',
  [HairColor.Purple]: 'purple',
  [HairColor.Brown]: 'brown',
};
