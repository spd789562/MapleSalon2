import {
  onCleanup,
  createEffect,
  createSignal,
  from,
  on,
  onMount,
  Show,
} from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import {
  $isGlobalRendererInitialized,
  $globalRenderer,
} from '@/store/renderer';
import { $previewCharacter } from '@/store/character/selector';
import { $otherCharacters, $enableCharacterEffect } from '@/store/chair';
import { $currentMount, $mountAction } from '@/store/mount';
import type { CharacterData, CharacterItemInfo } from '@/store/character/store';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  $zoomTarget,
  $previewChairZoomInfo,
  updateCenter,
  updateZoom,
} from '@/store/previewChairZoom';

import { $isMapleMapScene } from '@/store/scene';
import { usePureStore } from '@/store';

import { useChatBalloonText } from '@/components/CharacterPreview/useChatBalloonText';
import { useCharacterVisible } from '@/components/tab/ChairTab/CharacterVisibleSwitch';
import { useCharacterEffectVisible } from '@/components/tab/ChairTab/EffectSwitch';
import { useResizableApp } from '@/hook/resizableApp';
import { MapleMapMount } from '@/hook/mapleMap';

import { Container } from 'pixi.js';
import { Character } from '@/renderer/character/character';
import { TamingMob } from '@/renderer/tamingMob/tamingMob';
import { ZoomContainer } from '@/renderer/ZoomContainer';

import { toaster } from '@/components/GlobalToast';

export interface CharacterPreviewViewProps {
  ref?: (element: TamingMob) => void;
  onLoad: () => void;
  onLoaded: () => void;
  target: string;
}
export const CharacterPreviewView = (props: CharacterPreviewViewProps) => {
  const zoomInfo = usePureStore($previewChairZoomInfo);
  const characterData = from($previewCharacter);
  const mountData = usePureStore($currentMount);
  const mountAction = usePureStore($mountAction);
  const otherCharacters = usePureStore($otherCharacters);
  const isRendererInitialized = usePureStore($isGlobalRendererInitialized);
  const isMap = usePureStore($isMapleMapScene);
  const [isInit, setIsInit] = createSignal<boolean>(false);
  const [mapTarget, setMapTarget] = createSignal<Container>(new Container());

  let container!: HTMLDivElement;
  let mount: TamingMob | undefined;
  let viewport: ZoomContainer | undefined;
  const mainCharacter = new Character();
  const characters: Character[] = [];

  useChatBalloonText(mainCharacter);
  useCharacterVisible([mainCharacter, characters]);
  useCharacterEffectVisible(
    [mainCharacter, characters],
    () => !!mount?.isHideEffect,
  );
  useResizableApp({
    viewport,
    container: () => container,
  });
  onMount(() => {
    setMapTarget(mainCharacter);
  });

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
    mount?.destroy();
    container.children.length > 0 && container.removeChild(app.canvas);
  });

  createEffect(async () => {
    const data = mountData();
    const mainCharacterData = characterData();
    const action = mountAction();
    const others = otherCharacters();
    if (!(isInit() && mainCharacterData)) {
      return;
    }

    // removing mount
    if (!data) {
      mount?.destroy();
      viewport?.addChild(mainCharacter);
      await mainCharacter.update(mainCharacterData);
      return;
    }
    mount?.destroy();
    // setup or update mount
    mount = new TamingMob(data.id);
    props.onLoad();
    props.ref?.(mount);
    await mount.load();
    if (characters.length < others.length) {
      for (let i = characters.length; i < others.length; i++) {
        characters.push(new Character());
      }
    }
    const needHideEffect = mount.isHideEffect || !$enableCharacterEffect.get();
    for (const character of characters) {
      character.toggleEffectVisibility(needHideEffect);
    }
    mainCharacter.toggleEffectVisibility(needHideEffect);
    mainCharacter.position.set(0, 0);

    type Tuple = [Character, CharacterData];
    const sitData = [[mainCharacter, mainCharacterData] as Tuple].concat(
      others.map((c, i) => [characters[i], c] as Tuple),
    ) as [Character, CharacterData][];
    await mount.sitCharacter(sitData, action);
    mount.playByInstructions();
    viewport?.addChild(mount);

    if ($isMapleMapScene.get()) {
      setMapTarget(mount);
    } else {
      viewport?.addChild(mount);
    }
    props.onLoaded();
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

  return (
    <>
      <CanvasContainer ref={container} />
      <Show when={isMap() && isInit()}>
        <MapleMapMount
          viewport={() => viewport}
          application={$globalRenderer.get()}
          singleTarget={mapTarget}
        />
      </Show>
    </>
  );
};

const CanvasContainer = styled('div', {
  base: {
    width: 'full',
    height: 'full',
  },
});
