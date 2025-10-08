import { onCleanup, createEffect, createSignal, from } from 'solid-js';
import type { ReadableAtom } from 'nanostores';
import { useTranslate } from '@/context/i18n';

import {
  $isGlobalRendererInitialized,
  $globalRenderer,
} from '@/store/renderer';
import type { CharacterData, CharacterItemInfo } from '@/store/character/store';
import { MAX_ZOOM, MIN_ZOOM, DEFAULT_CENTER } from '@/store/previewZoom';
import { usePureStore } from '@/store';

import { useChatBalloonText } from '@/components/CharacterPreview/useChatBalloonText';
import { useCharacterFlip } from '@/components/CharacterPreview/useCharacterFlip';

import { Character } from '@/renderer/character/character';
import { ZoomContainer } from '@/renderer/ZoomContainer';

import { toaster } from '@/components/GlobalToast';

export type MiniCharacterForwardProps = {
  resetZoom: () => void;
  resetPosition: () => void;
};

export interface MiniCharacterPreviewProps {
  forwardRef: (ref: MiniCharacterForwardProps) => void;
  onLoad: () => void;
  onLoaded: () => void;
  store: ReadableAtom<CharacterData>;
}
export const MiniCharacterPreview = (props: MiniCharacterPreviewProps) => {
  const t = useTranslate();

  const characterData = from(props.store);
  const isRendererInitialized = usePureStore($isGlobalRendererInitialized);
  const [isInit, setIsInit] = createSignal<boolean>(false);
  let container!: HTMLDivElement;
  let viewport: ZoomContainer | undefined;
  const ch = new Character();
  useChatBalloonText(ch);
  useCharacterFlip([ch]);
  ch.loadEvent.addListener('loading', props.onLoad);
  ch.loadEvent.addListener('loaded', props.onLoaded);
  ch.loadEvent.addListener(
    'error',
    function onEquipLoadError(payload: CharacterItemInfo[]) {
      const names = payload.map((item) => item.name || item.id).join(', ');
      toaster.error({
        title: t('error.equipmentLoadFailed'),
        description: t('error.equipmentLoadFailedDesc', { errorNames: names }),
      });
    },
  );

  function initScene() {
    const app = $globalRenderer.get();
    app.renderer.resize(300, 340);
    viewport = new ZoomContainer(app, {
      width: 300,
      height: 340,
      worldScale: 2,
      maxScale: MAX_ZOOM,
    });
    viewport.scaled = 1;
    viewport.moveCenter(DEFAULT_CENTER);
    viewport.on('zoomed', (e) => {
      const viewport = e.viewport as ZoomContainer;
      if (
        viewport &&
        viewport.scaled <= MAX_ZOOM &&
        viewport.scaled >= MIN_ZOOM
      ) {
        const clampedScaled = (viewport.scaled * 100) / 100;
        viewport.scaled = clampedScaled;
      }
    });
    container.appendChild(app.canvas);
    viewport.addChild(ch);

    app.stage.addChild(viewport);

    setIsInit(true);
  }

  createEffect(() => {
    if (isRendererInitialized()) {
      initScene();
    }
  });

  onCleanup(() => {
    const app = $globalRenderer.get();
    if (viewport) {
      app.stage.removeChild(viewport);
      viewport.removeAllListeners();
      viewport.destroy({
        children: true,
      });
    }
    container.children.length > 0 && container.removeChild(app.canvas);
  });

  createEffect(async () => {
    const data = characterData();
    if (isInit() && data) {
      await ch.update(data);
    }
  });

  function resetZoom() {
    if (viewport) {
      viewport.scaled = 1;
    }
  }
  function resetPosition() {
    if (viewport) {
      viewport.moveCenter(DEFAULT_CENTER);
    }
  }

  props.forwardRef({
    resetZoom,
    resetPosition,
  });

  return <div ref={container} />;
};
