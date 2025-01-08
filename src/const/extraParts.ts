import type { I18nKeys } from '@/context/i18n';

export enum CharacterExtraPart {
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

export const CharacterExtraPartNames: Record<CharacterExtraPart, I18nKeys> = {
  [CharacterExtraPart.DemonSlayerWing]: 'character.partDemonSlayerWing',
  [CharacterExtraPart.DemonSlayerBigWing]: 'character.partDemonSlayerBigWing',
  [CharacterExtraPart.DemonSlayer5thWing]: 'character.partDemonSlayer5thWing',

  [CharacterExtraPart.KaiserWing]: 'character.partKaiserWing',
  [CharacterExtraPart.KaiserTail]: 'character.partKaiserTail',
  [CharacterExtraPart.KaiserWing2]: 'character.partKaiserWing2',
  [CharacterExtraPart.KaiserTail2]: 'character.partKaiserTail2',
  [CharacterExtraPart.KaiserWing3]: 'character.partKaiserWing3',
  [CharacterExtraPart.KaiserTail3]: 'character.partKaiserTail3',

  [CharacterExtraPart.AngelicBusterWing]: 'character.partAngelicBusterWing',
  [CharacterExtraPart.AngelicBusterTransformWing]:
    'character.partAngelicBusterTransformWing',

  [CharacterExtraPart.BeastTamerBrownEar]: 'character.partBeastTamerBrownEar',
  [CharacterExtraPart.BeastTamerBrownTail]: 'character.partBeastTamerBrownTail',
  [CharacterExtraPart.BeastTamerWhiteEar]: 'character.partBeastTamerWhiteEar',
  [CharacterExtraPart.BeastTamerWhiteTail]: 'character.partBeastTamerWhiteTail',
  [CharacterExtraPart.BeastTamerBlackEar]: 'character.partBeastTamerBlackEar',
  [CharacterExtraPart.BeastTamerBlackTail]: 'character.partBeastTamerBlackTail',

  [CharacterExtraPart.Illium0thWing]: 'character.partIllium0thWing',
  [CharacterExtraPart.Illium1stWing]: 'character.partIllium1stWing',
  [CharacterExtraPart.Illium2ndWing]: 'character.partIllium2ndWing',
  [CharacterExtraPart.Illium3rdWing]: 'character.partIllium3rdWing',
  [CharacterExtraPart.IlliumVortexWing]: 'character.partIlliumVortexWing',

  [CharacterExtraPart.HoyoungEars]: 'character.partHoyoungEars',
  [CharacterExtraPart.HoyoungTail]: 'character.partHoyoungTail',

  [CharacterExtraPart.LaraHorn]: 'character.partLaraHorn',
};

export const CharacterExtraPartIdMap: Record<CharacterExtraPart, number> = {
  [CharacterExtraPart.DemonSlayerWing]: 5010084,
  [CharacterExtraPart.DemonSlayerBigWing]: 5010085,
  [CharacterExtraPart.DemonSlayer5thWing]: 5010152,

  [CharacterExtraPart.KaiserWing]: 5010087,
  [CharacterExtraPart.KaiserTail]: 5010090,
  [CharacterExtraPart.KaiserWing2]: 5010088,
  [CharacterExtraPart.KaiserTail2]: 5010091,
  [CharacterExtraPart.KaiserWing3]: 5010089,
  [CharacterExtraPart.KaiserTail3]: 5010092,

  [CharacterExtraPart.AngelicBusterWing]: 5010093,
  [CharacterExtraPart.AngelicBusterTransformWing]: 5010094,

  [CharacterExtraPart.BeastTamerBrownEar]: 5010116,
  [CharacterExtraPart.BeastTamerBrownTail]: 5010119,
  [CharacterExtraPart.BeastTamerWhiteEar]: 5010117,
  [CharacterExtraPart.BeastTamerWhiteTail]: 5010120,
  [CharacterExtraPart.BeastTamerBlackEar]: 5010118,
  [CharacterExtraPart.BeastTamerBlackTail]: 5010121,

  [CharacterExtraPart.Illium0thWing]: 5010160,
  [CharacterExtraPart.Illium1stWing]: 5010161,
  [CharacterExtraPart.Illium2ndWing]: 5010162,
  [CharacterExtraPart.Illium3rdWing]: 5010163,
  [CharacterExtraPart.IlliumVortexWing]: 5010164,

  [CharacterExtraPart.HoyoungEars]: 5010176,
  [CharacterExtraPart.HoyoungTail]: 5010177,

  [CharacterExtraPart.LaraHorn]: 5010193,
};

export const CharacterExtraPartIdToPartMap: Record<string, CharacterExtraPart> =
  {
    [5010084]: CharacterExtraPart.DemonSlayerWing,
    [5010085]: CharacterExtraPart.DemonSlayerBigWing,
    [5010152]: CharacterExtraPart.DemonSlayer5thWing,

    [5010087]: CharacterExtraPart.KaiserWing,
    [5010090]: CharacterExtraPart.KaiserTail,
    [5010088]: CharacterExtraPart.KaiserWing2,
    [5010091]: CharacterExtraPart.KaiserTail2,
    [5010089]: CharacterExtraPart.KaiserWing3,
    [5010092]: CharacterExtraPart.KaiserTail3,

    [5010093]: CharacterExtraPart.AngelicBusterWing,
    [5010094]: CharacterExtraPart.AngelicBusterTransformWing,

    [5010116]: CharacterExtraPart.BeastTamerBrownEar,
    [5010119]: CharacterExtraPart.BeastTamerBrownTail,
    [5010117]: CharacterExtraPart.BeastTamerWhiteEar,
    [5010120]: CharacterExtraPart.BeastTamerWhiteTail,
    [5010118]: CharacterExtraPart.BeastTamerBlackEar,
    [5010121]: CharacterExtraPart.BeastTamerBlackTail,

    [5010160]: CharacterExtraPart.Illium0thWing,
    [5010161]: CharacterExtraPart.Illium1stWing,
    [5010162]: CharacterExtraPart.Illium2ndWing,
    [5010163]: CharacterExtraPart.Illium3rdWing,
    [5010164]: CharacterExtraPart.IlliumVortexWing,

    [5010176]: CharacterExtraPart.HoyoungEars,
    [5010177]: CharacterExtraPart.HoyoungTail,

    [5010193]: CharacterExtraPart.LaraHorn,
  };

export function isValidCharacterExtraPart(
  part: string,
): part is CharacterExtraPart {
  return part in CharacterExtraPartIdMap;
}
