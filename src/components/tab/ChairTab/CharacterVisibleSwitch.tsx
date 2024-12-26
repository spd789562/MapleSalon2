import { createEffect } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $showCharacter } from '@/store/chair';
import { $showChatBalloon, $showNameTag } from '@/store/character/selector';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

import type { Character } from '@/renderer/character/character';

export const useCharacterVisible = (character: (Character | Character[])[]) => {
  const visible = useStore($showCharacter);

  createEffect(() => {
    const isVis = visible();
    for (const c of character.flat()) {
      c.nameTag.visible = isVis && $showNameTag.get();
      c.bodyContainer.visible = isVis;
      c.chatBalloon.visible = isVis && $showChatBalloon.get();
    }
  });

  return visible;
};

export const CharacterVisibleSwitch = () => {
  const t = useTranslate();
  const visible = useStore($showCharacter);

  function handleChange(details: ChangeDetails) {
    $showCharacter.set(details.checked);
  }

  return (
    <Switch checked={visible()} onCheckedChange={handleChange}>
      {t('character.show')}
    </Switch>
  );
};
