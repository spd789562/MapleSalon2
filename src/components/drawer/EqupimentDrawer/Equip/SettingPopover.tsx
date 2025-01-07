import { Portal } from 'solid-js/web';
import { useTranslate } from '@/context/i18n';

import { useHoverTrigger } from '@/hook/hoverTrigger';

import Settings2 from 'lucide-solid/icons/settings-2';
import * as Popover from '@/components/ui/popover';
import { VStack } from 'styled-system/jsx/vstack';
import { CharacterRenderingSwitch } from './CharacterRenderingSwitch';
import { GenderSelect } from './GenderSelect';
const HOVER_DELAY = 300;

export const SettingPopover = () => {
  const t = useTranslate();
  const {
    isOpen,
    onHover: handleHoverTrigger,
    resetHoverTimer: handleResetHoverTimer,
    onOutsideClick: handleOutsideClick,
  } = useHoverTrigger({ delay: HOVER_DELAY });

  return (
    <Popover.Root
      open={isOpen()}
      positioning={{
        strategy: 'fixed',
        placement: 'bottom-start',
      }}
      onInteractOutside={handleOutsideClick}
    >
      <Popover.Trigger
        onMouseOver={handleHoverTrigger}
        onMouseOut={handleResetHoverTimer}
        cursor={'pointer'}
      >
        <Settings2 />
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="10rem">
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <VStack alignItems="flex-start">
              <CharacterRenderingSwitch />
              <GenderSelect />
            </VStack>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
