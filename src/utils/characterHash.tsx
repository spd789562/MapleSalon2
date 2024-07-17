import type { CharacterData, CharacterItemInfo } from '@/store/character/store';

export function makeCharacterHash(character: CharacterData) {
  let baseHash = [
    character.action,
    character.expression,
    character.earType,
    character.handType,
    character.frame,
    character.isAnimating,
  ].join(',');

  for (const key in character.items) {
    const item = character.items[
      key as keyof CharacterData['items']
    ] as CharacterItemInfo;
    baseHash += `,${key},${item.id}`;
    baseHash += [
      item.hue,
      item.saturation,
      item.brightness,
      item.dye?.color,
      item.dye?.alpha,
    ]
      .filter((e) => !!e)
      .join(',');
  }

  return baseHash;
}
