export enum CharacterExpressions {
  Default = 'default',
  Hit = 'hit',
  Smile = 'smile',
  Troubled = 'troubled',
  Cry = 'cry',
  Angry = 'angry',
  Bewildered = 'bewildered',
  Stunned = 'stunned',
  Blink = 'blink',
  /* cash */
  Hum = 'hum',
  Despair = 'despair',
  Oops = 'oops',
  Vomit = 'vomit',
  Bowing = 'bowing',
  Dam = 'dam',
  Pain = 'pain',
  Hot = 'hot',
  Cheers = 'cheers',
  Wink = 'wink',
  Blaze = 'blaze',
  Chu = 'chu',
  Shine = 'shine',
  Glitter = 'glitter',
  Love = 'love',
  /* gms */
  QBlue = 'qBlue',
}

export const ExpressionsHasEye = [
  CharacterExpressions.Default,
  CharacterExpressions.Hit,
  CharacterExpressions.Blink,
  CharacterExpressions.Wink,
  CharacterExpressions.Glitter,
];

export function isValidExpression(
  expression: string,
): expression is CharacterExpressions {
  return Object.values(CharacterExpressions).includes(
    expression as CharacterExpressions,
  );
}
