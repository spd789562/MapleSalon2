import { createEffect } from 'solid-js';

import { $characterFlip } from '@/store/character/store';

import { usePureStore } from '@/store';
import type { Character } from '@/renderer/character/character';

export function useCharacterFlip(character: Character[]) {
  const characterFlip = usePureStore($characterFlip);

  createEffect(() => {
    for (const ch of character) {
      ch.updateFlip(characterFlip());
      ch.bodyContainer.scale.x = ch.forceScale * (ch.flip ? -1 : 1);
    }
  });
}
