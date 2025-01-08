import type { I18nKeys } from '@/context/i18n';

export enum ExtraPart {
  DemonSlayerWing = 'DemonSlayerWing',
  DemonSlayerBigWing = 'DemonSlayerBigWing',
  DemonSlayer5thWing = 'DemonSlayer5thWing',

  KaiserWing = 'KaiserWing',
  KaiserTail = 'KaiserTail',
  KaiserWing2 = 'KaiserWing2',
  KaiserTail2 = 'KaiserTail2',
  KaiserWing3 = 'KaiserWing3',
  KaiserTail3 = 'KaiserTail3',

  AngelicBusterWing = 'AngelicBusterWing',
  AngelicBusterTransformWing = 'AngelicBusterTransformWing',

  BeastTamerBrownEar = 'BeastTamerBrownEar',
  BeastTamerBrownTail = 'BeastTamerBrownTail',
  BeastTamerWhiteEar = 'BeastTamerWhiteEar',
  BeastTamerWhiteTail = 'BeastTamerWhiteTail',
  BeastTamerBlackEar = 'BeastTamerBlackEar',
  BeastTamerBlackTail = 'BeastTamerBlackTail',

  Illium0thWing = 'Illium0thWing',
  Illium1stWing = 'Illium1stWing',
  Illium2ndWing = 'Illium2ndWing',
  Illium3rdWing = 'Illium3rdWing',
  IlliumVortexWing = 'IlliumVortexWing',

  HoyoungEars = 'HoyoungEars',
  HoyoungTail = 'HoyoungTail',

  LaraHorn = 'LaraHorn',
}

export const ExtraPartNames: Record<ExtraPart, I18nKeys> = {
  [ExtraPart.DemonSlayerWing]: 'character.partDemonSlayerWing',
  [ExtraPart.DemonSlayerBigWing]: 'character.partDemonSlayerBigWing',
  [ExtraPart.DemonSlayer5thWing]: 'character.partDemonSlayer5thWing',

  [ExtraPart.KaiserWing]: 'character.partKaiserWing',
  [ExtraPart.KaiserTail]: 'character.partKaiserTail',
  [ExtraPart.KaiserWing2]: 'character.partKaiserWing2',
  [ExtraPart.KaiserTail2]: 'character.partKaiserTail2',
  [ExtraPart.KaiserWing3]: 'character.partKaiserWing3',
  [ExtraPart.KaiserTail3]: 'character.partKaiserTail3',

  [ExtraPart.AngelicBusterWing]: 'character.partAngelicBusterWing',
  [ExtraPart.AngelicBusterTransformWing]:
    'character.partAngelicBusterTransformWing',

  [ExtraPart.BeastTamerBrownEar]: 'character.partBeastTamerBrownEar',
  [ExtraPart.BeastTamerBrownTail]: 'character.partBeastTamerBrownTail',
  [ExtraPart.BeastTamerWhiteEar]: 'character.partBeastTamerWhiteEar',
  [ExtraPart.BeastTamerWhiteTail]: 'character.partBeastTamerWhiteTail',
  [ExtraPart.BeastTamerBlackEar]: 'character.partBeastTamerBlackEar',
  [ExtraPart.BeastTamerBlackTail]: 'character.partBeastTamerBlackTail',

  [ExtraPart.Illium0thWing]: 'character.partIllium0thWing',
  [ExtraPart.Illium1stWing]: 'character.partIllium1stWing',
  [ExtraPart.Illium2ndWing]: 'character.partIllium2ndWing',
  [ExtraPart.Illium3rdWing]: 'character.partIllium3rdWing',
  [ExtraPart.IlliumVortexWing]: 'character.partIlliumVortexWing',

  [ExtraPart.HoyoungEars]: 'character.partHoyoungEars',
  [ExtraPart.HoyoungTail]: 'character.partHoyoungTail',

  [ExtraPart.LaraHorn]: 'character.partLaraHorn',
};

export const ExtraPartIdMap: Record<ExtraPart, number> = {
  [ExtraPart.DemonSlayerWing]: 5010084,
  [ExtraPart.DemonSlayerBigWing]: 5010085,
  [ExtraPart.DemonSlayer5thWing]: 5010152,

  [ExtraPart.KaiserWing]: 5010087,
  [ExtraPart.KaiserTail]: 5010090,
  [ExtraPart.KaiserWing2]: 5010088,
  [ExtraPart.KaiserTail2]: 5010091,
  [ExtraPart.KaiserWing3]: 5010089,
  [ExtraPart.KaiserTail3]: 5010092,

  [ExtraPart.AngelicBusterWing]: 5010093,
  [ExtraPart.AngelicBusterTransformWing]: 5010094,

  [ExtraPart.BeastTamerBrownEar]: 5010116,
  [ExtraPart.BeastTamerBrownTail]: 5010119,
  [ExtraPart.BeastTamerWhiteEar]: 5010117,
  [ExtraPart.BeastTamerWhiteTail]: 5010116,
  [ExtraPart.BeastTamerBlackEar]: 5010120,
  [ExtraPart.BeastTamerBlackTail]: 5010121,

  [ExtraPart.Illium0thWing]: 5010160,
  [ExtraPart.Illium1stWing]: 5010161,
  [ExtraPart.Illium2ndWing]: 5010162,
  [ExtraPart.Illium3rdWing]: 5010163,
  [ExtraPart.IlliumVortexWing]: 5010164,

  [ExtraPart.HoyoungEars]: 5010176,
  [ExtraPart.HoyoungTail]: 5010177,

  [ExtraPart.LaraHorn]: 5010193,
};

export function isValidPart(part: string): part is ExtraPart {
  return part in ExtraPartIdMap;
}
