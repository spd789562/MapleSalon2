import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $sceneCustomColorStyle } from '@/store/character/selector';
import { $currentScene } from '@/store/character/store';
import { $sceneSelectionOpen } from '@/store/trigger';

import ChevronLeftIcon from 'lucide-solid/icons/chevron-left';
import { CharacterSceneRadioGroup } from './CharacterSceneRadioGroup';

import { PreviewSceneBackground, PreviewSceneNames } from '@/const/scene';

export const CharacterSceneSelection = () => {
  const scene = useStore($currentScene);
  const customColorStyle = useStore($sceneCustomColorStyle);
  const isOpen = useStore($sceneSelectionOpen);

  function handleToggle() {
    $sceneSelectionOpen.set(!isOpen());
  }

  return (
    <Positioner>
      <SelectionContainer data-state={isOpen() ? 'closed' : 'open'}>
        <SelectionToggleButton
          title="收合場景選擇列表"
          data-state={isOpen() ? 'closed' : 'open'}
          onClick={handleToggle}
        >
          <ChevronLeftIcon size={24} />
        </SelectionToggleButton>
        <CharacterSceneRadioGroup />
      </SelectionContainer>
      <BlockContainer onClick={handleToggle}>
        <BackgroundBlock
          title={PreviewSceneNames[scene()]}
          bgType={scene()}
          style={customColorStyle()}
        />
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
      color: {
        border: '1px solid',
        borderColor: 'border.muted',
      },
      henesys: {
        ...PreviewSceneBackground.henesys,
        backgroundPosition: 'left bottom',
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
