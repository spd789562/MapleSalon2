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

export const CharacterExpressionsOrder = [
  CharacterExpressions.Blink,
  CharacterExpressions.Hit,
  CharacterExpressions.Smile,
  CharacterExpressions.Troubled,
  CharacterExpressions.Cry,
  CharacterExpressions.Angry,
  CharacterExpressions.Bewildered,
  CharacterExpressions.Stunned,
  CharacterExpressions.Vomit,
  CharacterExpressions.Oops,
  CharacterExpressions.Cheers,
  CharacterExpressions.Chu,
  CharacterExpressions.Wink,
  CharacterExpressions.Pain,
  CharacterExpressions.Glitter,
  CharacterExpressions.Despair,
  CharacterExpressions.Love,
  CharacterExpressions.Shine,
  CharacterExpressions.Blaze,
  CharacterExpressions.Hum,
  CharacterExpressions.Bowing,
  CharacterExpressions.Hot,
  CharacterExpressions.Dam,
  CharacterExpressions.Default,
];

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
