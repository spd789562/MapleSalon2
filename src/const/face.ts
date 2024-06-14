export enum FaceColor {
  Black = '0',
  Blue = '1',
  Red = '2',
  Green = '3',
  Hazel = '4',
  Sapphire = '5',
  Violet = '6',
  Amethyst = '7',
  White = '8',
}

export type FaceColorId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const FaceColorHex = {
  [FaceColor.Black]: '#000000',
  [FaceColor.Blue]: '#2d7fcc',
  [FaceColor.Red]: '#ff5959',
  [FaceColor.Green]: '#a0d893',
  [FaceColor.Hazel]: '#f5e239',
  [FaceColor.Sapphire]: '#53c2d1',
  [FaceColor.Violet]: '#b393d8',
  [FaceColor.Amethyst]: '#cb31ac',
  [FaceColor.White]: '#cdcdcd',
};

export const FaceColorText = {
  [FaceColor.Black]: 'black',
  [FaceColor.Blue]: 'blue',
  [FaceColor.Red]: 'red',
  [FaceColor.Green]: 'green',
  [FaceColor.Hazel]: 'hazel',
  [FaceColor.Sapphire]: 'sapphire',
  [FaceColor.Violet]: 'violet',
  [FaceColor.Amethyst]: 'amethyst',
  [FaceColor.White]: 'white',
};
