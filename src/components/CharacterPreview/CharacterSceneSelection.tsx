import { Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';
import { styled } from 'styled-system/jsx/factory';

import { $sceneCustomStyle, $currentScene } from '@/store/scene';
import { $sceneSelectionOpen } from '@/store/trigger';

import ImageIcon from 'lucide-solid/icons/image';
import MapPinned from 'lucide-solid/icons/map-pinned';
import ChevronLeftIcon from 'lucide-solid/icons/chevron-left';
import { CharacterSceneRadioGroup } from './CharacterSceneRadioGroup';

import {
  PreviewScene,
  PreviewSceneBackground,
  PreviewSceneNames,
} from '@/const/scene';

export const CharacterSceneSelection = () => {
  const t = useTranslate();
  const scene = useStore($currentScene);
  const customColorStyle = useStore($sceneCustomStyle);
  const isOpen = useStore($sceneSelectionOpen);

  function handleToggle() {
    $sceneSelectionOpen.set(!isOpen());
  }

  return (
    <Positioner>
      <SelectionContainer id="character-preview-scene-selection" data-state={isOpen() ? 'closed' : 'open'}>
        <SelectionToggleButton
          title={t('scene.toggleSceneSelection')}
          data-state={isOpen() ? 'closed' : 'open'}
          onClick={handleToggle}
        >
          <ChevronLeftIcon size={24} />
        </SelectionToggleButton>
        <CharacterSceneRadioGroup />
      </SelectionContainer>
      <BlockContainer onClick={handleToggle}>
        <BackgroundBlock
          title={t(PreviewSceneNames[scene()]) as string}
          bgType={scene()}
          style={customColorStyle()}
        >
          <Switch>
            <Match when={scene() === PreviewScene.Custom}>
              <ImageIcon size={24} />
            </Match>
            <Match when={scene() === PreviewScene.MapleMap}>
              <MapPinned size={24} />
            </Match>
          </Switch>
        </BackgroundBlock>
      </BlockContainer>
    </Positioner>
  );
};

const Positioner = styled('div', {
  base: {
    position: 'absolute',
    bottom: 1,
    right: 0,
    p: 2,
    opacity: 0.6,
    transition: 'opacity 0.2s',
    _hover: {
      opacity: 1,
    },
  },
});

const BlockContainer = styled('div', {
  base: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    p: 2,
    boxShadow: 'md',
    borderRadius: 'l2',
    bg: 'bg.default',
  },
});

const BackgroundBlock = styled('div', {
  base: {
    cursor: 'pointer',
    borderRadius: 'l1',
    width: 6,
    height: 6,
  },
  variants: {
    bgType: {
      alpha: {
        ...PreviewSceneBackground.alpha,
      },
      grid: {
        ...PreviewSceneBackground.grid,
      },
      color: {
        border: '1px solid',
        borderColor: 'border.muted',
        color: 'gray.11',
      },
      henesys: {
        ...PreviewSceneBackground.henesys,
        backgroundPosition: 'left bottom',
      },
      custom: {
        ...PreviewSceneBackground.custom,
      },
      mapleMap: {
        color: 'gray.11',
      },
    },
  },
});

const SelectionToggleButton = styled('button', {
  base: {
    py: 2,
    width: 4,
    height: 'full',
    display: 'flex',
    cursor: 'pointer',
    justifyContent: 'center',
    _dark: {
      color: 'accent.fg',
    },
    _closed: {
      transform: 'rotate(0)',
    },
    _open: {
      transform: 'rotate(180deg)',
    },
    _hover: {
      color: 'accent.emphasized',
    },
  },
});

const SelectionContainer = styled('div', {
  base: {
    bottom: 0,
    right: 14,
    height: 10,
    paddingRight: 2,
    position: 'absolute',
    transition: 'transform 0.4s ease',
    display: 'flex',
    boxShadow: 'md',
    borderRadius: 'l2',
    bg: 'bg.default',
    _closed: {
      transform: 'translateX(100%)',
    },
    _open: {
      transform: 'translateX(0)',
    },
  },
});
