import { createEffect } from 'solid-js';

import { $chatBalloonContent } from '@/store/character/store';
import { $currentName } from '@/store/character/selector';

import { usePureStore } from '@/store';

import type { Character } from '@/renderer/character/character';

export function useChatBalloonText(character: Character) {
  const chatBalloonContent = usePureStore($chatBalloonContent);
  const name = usePureStore($currentName);

  createEffect(() => {
    character.chatBalloon.updateText(`${name()}: ${chatBalloonContent()}`);
  });
}
