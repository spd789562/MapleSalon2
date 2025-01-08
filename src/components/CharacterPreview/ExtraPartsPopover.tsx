import { Portal, For } from 'solid-js/web';
import { computed } from 'nanostores';
import { useTranslate } from '@/context/i18n';
import { usePureStore } from '@/store';

import { $characterExtraParts } from '@/store/character/store';
import { $currentExtraParts } from '@/store/character/selector';
import { toggleExtraPart } from '@/store/character/action';

import { useHoverTrigger } from '@/hook/hoverTrigger';

import * as Popover from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { SimpleCheckbox } from '@/components/ui/checkbox';
import { VStack } from 'styled-system/jsx/vstack';

import {
  type CharacterExtraPart,
  CharacterExtraPartNames,
} from '@/const/extraParts';

const HOVER_DELAY = 300;

export const ExtraPartsPopover = () => {
  const t = useTranslate();
  const parts = usePureStore($characterExtraParts);

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
        <Button variant="outline">{t('character.extraPart')}</Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="15rem" maxHeight="20rem" overflow="auto">
            <VStack alignItems="flex-start">
              <For each={parts()}>
                {(part) => (
                  <ExtraPartCheckBox
                    part={part.part}
                    disabled={part.disabled}
                  />
                )}
              </For>
            </VStack>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

interface ExtraPartCheckBoxProps {
  part: CharacterExtraPart;
  disabled: boolean;
}
const ExtraPartCheckBox = (props: ExtraPartCheckBoxProps) => {
  const t = useTranslate();
  const checkedSelector = computed($currentExtraParts, (parts) => {
    return parts.includes(props.part);
  });
  const checked = usePureStore(checkedSelector);
  return (
    <SimpleCheckbox
      checked={checked()}
      disabled={props.disabled}
      onCheckedChange={() => {
        toggleExtraPart(props.part);
      }}
    >
      {t(CharacterExtraPartNames[props.part]) as string}
    </SimpleCheckbox>
  );
};
