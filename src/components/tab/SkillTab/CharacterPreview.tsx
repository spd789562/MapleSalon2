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
import { $enableCharacterEffect } from '@/store/chair';
import { $currentSkill } from '@/store/skill';
import type { CharacterItemInfo } from '@/store/character/store';
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
import { useSkillTab } from './SkillTabContext';

import { Character } from '@/renderer/character/character';
import type { Skill } from '@/renderer/skill/skill';
import { ZoomContainer } from '@/renderer/ZoomContainer';

import { toaster } from '@/components/GlobalToast';

export interface CharacterPreviewViewProps {
  onLoad: () => void;
  onLoaded: () => void;
  target: string;
}
export const CharacterPreviewView = (props: CharacterPreviewViewProps) => {
  const zoomInfo = usePureStore($previewChairZoomInfo);
  const characterData = from($previewCharacter);
  const skillData = usePureStore($currentSkill);
  const enableCharacterEffect = usePureStore($enableCharacterEffect);
  const isRendererInitialized = usePureStore($isGlobalRendererInitialized);
  const [isInit, setIsInit] = createSignal<boolean>(false);
  const [_, { setCharacterRef, setSkillRef }] = useSkillTab();

  const canvasResizeObserver = new ResizeObserver(handleCanvasResize);

  let container!: HTMLDivElement;
  let skill: Skill | undefined;
  let viewport: ZoomContainer | undefined;
  const character = new Character();

  useChatBalloonText(character);
  setCharacterRef(character);

  character.loadEvent.addListener(
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
    viewport?.addChild(character);

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
    character.destroy();
    skill?.destroy();
    container.children.length > 0 && container.removeChild(app.canvas);
    canvasResizeObserver.disconnect();
  });

  createEffect(async () => {
    const data = skillData();
    const mainCharacterData = characterData();
    if (!(isInit() && mainCharacterData)) {
      return;
    }
    props.onLoad();
    character.toggleEffectVisibility(!$enableCharacterEffect.get());

    await character.update({ ...mainCharacterData, skillId: data?.id });
    setSkillRef(character.skill);

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

  createEffect(() => {
    const enableEffect = enableCharacterEffect();
    character.toggleEffectVisibility(!enableEffect);
  });

  return <CanvasContainer ref={container} />;
};

const CanvasContainer = styled('div', {
  base: {
    width: 'full',
    height: 'calc(100vh - 270px)',
  },
});
