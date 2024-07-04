import { createEffect, createSignal, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $isGlobalRendererInitialized,
  $globalRenderer,
} from '@/store/renderer';
import type { CharacterItems, CharacterInfo } from '@/store/character';

import { Character } from '@/renderer/character/character';

import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterHandType } from '@/const/hand';
import { CharacterEarType } from '@/const/ears';

export interface SimpleCharacterProps extends Partial<CharacterInfo> {
  title: string;
  items: Partial<CharacterItems>;
}
export const SimpleCharacter = (props: SimpleCharacterProps) => {
  const isInit = useStore($isGlobalRendererInitialized);
  const [url, setUrl] = createSignal<string>('');

  const [isLoading, setIsLoading] = createSignal(false);

  const character = new Character();
  character.loadEvent.addListener('loading', () => setIsLoading(true));
  character.loadEvent.addListener('loaded', () => setIsLoading(false));

  createEffect(async () => {
    if (isInit()) {
      const app = $globalRenderer.get();
      await character.update({
        frame: props.frame || 0,
        isAnimating: !!props.isAnimating,
        action: props.action || CharacterAction.Stand1,
        expression: props.expression || CharacterExpressions.Default,
        earType: props.earType || CharacterEarType.HumanEar,
        handType: props.handType || CharacterHandType.SingleHand,
        items: props.items,
      });
      if (app.renderer?.extract) {
        const image = await app.renderer.extract.base64(character);
        setUrl(image);
      }
    }
  });

  return (
    <Show when={url()}>
      <img src={url()} alt={props.title} />
    </Show>
  );
};
