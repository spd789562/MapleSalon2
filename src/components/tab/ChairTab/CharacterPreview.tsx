import {
  onCleanup,
  createEffect,
  createSignal,
  from,
  on,
  onMount,
} from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import {
  $isGlobalRendererInitialized,
  $globalRenderer,
} from '@/store/renderer';
import { $previewCharacter } from '@/store/character/selector';
import {
  $currentChair,
  $otherCharacters,
  $enableCharacterEffect,
} from '@/store/chair';
import type { CharacterData, CharacterItemInfo } from '@/store/character/store';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  $zoomTarget,
  $previewChairZoomInfo,
  updateCenter,
  updateZoom,
} from '@/store/previewChairZoom';
import { usePureStore } from '@/store';

import { useChatBalloonText } from '@/components/CharacterPreview/useChatBalloonText';
import { useCharacterVisible } from './CharacterVisibleSwitch';
import { useCharacterEffectVisible } from './EffectSwitch';

import { Character } from '@/renderer/character/character';
import { Chair } from '@/renderer/chair/chair';
import { ZoomContainer } from '@/renderer/ZoomContainer';

import { toaster } from '@/components/GlobalToast';

export interface CharacterPreviewViewProps {
  ref?: (element: Chair) => void;
  onLoad: () => void;
  onLoaded: () => void;
  target: string;
}
export const CharacterPreviewView = (props: CharacterPreviewViewProps) => {
  const zoomInfo = usePureStore($previewChairZoomInfo);
  const characterData = from($previewCharacter);
  const chairData = usePureStore($currentChair);
  const otherCharacters = usePureStore($otherCharacters);
  const isRendererInitialized = usePureStore($isGlobalRendererInitialized);
  const [isInit, setIsInit] = createSignal<boolean>(false);

  const canvasResizeObserver = new ResizeObserver(handleCanvasResize);

  let container!: HTMLDivElement;
  let chair: Chair | undefined;
  let viewport: ZoomContainer | undefined;
  const mainCharacter = new Character();
  const characters: Character[] = [];
  // const chair = new Chair(3016204, '03016.img');
  // const chair = new Chair(3018909, '03018.img');
  // const chair = new Chair(3018528, '03018.img');
  // const chair = new Chair(3015895, '030158.img');
  useChatBalloonText(mainCharacter);
  useCharacterVisible([mainCharacter, characters]);
  useCharacterEffectVisible(
    [mainCharacter, characters],
    () => !!chair?.isHideEffect,
  );

  mainCharacter.loadEvent.addListener(
    'error',
    function onEquipLoadError(payload: CharacterItemInfo[]) {
      const names = payload.map((item) => item.name || item.id).join(', ');
      toaster.error({
        title: '裝備載入失敗',
        description: `下列裝備載入失敗：${names}`,
      });
    },
  );

  function handleCanvasResize() {
    const app = $globalRenderer.get();
    app.renderer.resize(container.clientWidth, container.clientHeight);
    viewport?.resize(app.screen.width, app.screen.height);
  }

  function initScene() {
    const app = $globalRenderer.get();
    app.resizeTo = container;
    app.renderer.resize(container.clientWidth, container.clientHeight);
    viewport = new ZoomContainer(app, {
      width: app.screen.width,
      height: app.screen.height,
      worldScale: 4,
      minScale: MIN_ZOOM,
      maxScale: MAX_ZOOM,
    });
    const defaultInfo = zoomInfo();
    viewport.scaled = defaultInfo.zoom;
    viewport.moveCenter(defaultInfo.center);
    viewport.on('zoomed', (e) => {
      const viewport = e.viewport as ZoomContainer;
      if (
        viewport &&
        viewport.scaled <= MAX_ZOOM &&
        viewport.scaled >= MIN_ZOOM &&
        !viewport?.destroyed
      ) {
        const clampedScaled = (viewport.scaled * 100) / 100;
        viewport.scaled = clampedScaled;
        updateZoom(clampedScaled, props.target);
      }
    });
    viewport.on('moved', (e) => {
      const isNotClamp = !e.type.includes('clamp');
      if (viewport && isNotClamp) {
        updateCenter(viewport.center, props.target);
      }
    });
    container.appendChild(app.canvas);
    app.stage.addChild(viewport);

    setIsInit(true);
  }

  createEffect(
    on(isRendererInitialized, (initialized) => {
      if (initialized) {
        initScene();
      }
    }),
  );

  onMount(() => {
    canvasResizeObserver.observe(container);
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
    mainCharacter.destroy();
    chair?.destroy();
    container.children.length > 0 && container.removeChild(app.canvas);
    canvasResizeObserver.disconnect();
  });

  createEffect(async () => {
    const data = chairData();
    const mainCharacterData = characterData();
    const others = otherCharacters();
    if (!(isInit() && mainCharacterData)) {
      return;
    }

    // removing chair
    if (!data) {
      chair?.destroy();
      viewport?.addChild(mainCharacter);
      await mainCharacter.update(mainCharacterData);
      return;
    }
    chair?.destroy();
    // setup or update chair
    chair = new Chair(data.id, data.folder);
    chair.loadEvent.addListener('loading', props.onLoad);
    chair.loadEvent.addListener('loaded', props.onLoaded);
    props.ref?.(chair);
    try {
      await chair.load();
    } catch (_) {
      toaster.error({
        title: '椅子載入失敗',
        description: '此椅子可能檔案不完全或尚未支援',
      });
      chair.destroy();
      return;
    }
    if (characters.length < others.length) {
      for (let i = characters.length; i < others.length; i++) {
        characters.push(new Character());
      }
    }
    const needHideEffect = chair.isHideEffect || !$enableCharacterEffect.get();
    for (const character of characters) {
      character.toggleEffectVisibility(needHideEffect);
    }
    mainCharacter.toggleEffectVisibility(needHideEffect);

    type Tuple = [Character, CharacterData];
    const sitData = [[mainCharacter, mainCharacterData] as Tuple].concat(
      others.map((c, i) => [characters[i], c] as Tuple),
    ) as [Character, CharacterData][];
    // double check the id
    if (chairData()?.id !== data.id) {
      return;
    }
    await chair.sitCharacter(sitData);
    chair.play();
    viewport?.addChild(chair);
  });

  createEffect(() => {
    const info = zoomInfo();
    const scaled = info.zoom;
    const center = info.center;
    /* only sync when target is not self */
    if (viewport && $zoomTarget.get() !== props.target) {
      viewport.scaled = scaled;
      viewport.moveCenter(center);
    }
  });

  return <CanvasContainer ref={container} />;
};

const CanvasContainer = styled('div', {
  base: {
    width: 'full',
    height: 'calc(100vh - 270px)',
  },
});
