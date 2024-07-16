import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $currentScene } from '@/store/character';
import { $sceneSelectionOpen } from '@/store/trigger';

import ChevronLeftIcon from 'lucide-solid/icons/chevron-left';
import { CharacterSceneRadioGroup } from './CharacterSceneRadioGroup';

import { PreviewSceneBackground, PreviewSceneNames } from '@/const/scene';

export const CharacterSceneSelection = () => {
  const scene = useStore($currentScene);
  const isOpen = useStore($sceneSelectionOpen);

  return (
    <Positioner>
      <SelectionContainer data-state={isOpen() ? 'closed' : 'open'}>
        <SelectionToggleButton
          title="收合場景選擇列表"
          data-state={isOpen() ? 'closed' : 'open'}
          onClick={() => $sceneSelectionOpen.set(!isOpen())}
        >
          <ChevronLeftIcon size={24} />
        </SelectionToggleButton>
        <CharacterSceneRadioGroup />
      </SelectionContainer>
      <BlockContainer>
        <BackgroundBlock title={PreviewSceneNames[scene()]} bgType={scene()} />
      </BlockContainer>
    </Positioner>
  );
};

const Positioner = styled('div', {
  base: {
    position: 'absolute',
    bottom: 0,
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
      black: {
        ...PreviewSceneBackground.black,
        border: '1px solid',
        borderColor: 'border.muted',
      },
      white: {
        ...PreviewSceneBackground.white,
        border: '1px solid',
        borderColor: 'border.muted',
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
