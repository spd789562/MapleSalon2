import type { JSX } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';
import { css } from 'styled-system/css';

import { $equipmentDrawerEquipCategorySelectionOpen } from '@/store/equipDrawer';

import {
  Root,
  Backdrop,
  Positioner,
  Content,
  Title,
  type OpenChangeDetails,
} from '@/components/ui/dialog';
import CloseIcon from 'lucide-solid/icons/x';
import { HStack } from 'styled-system/jsx/hstack';
import { IconButton } from '@/components/ui/icon-button';
import { OnlyShowDyeableSwitch } from './OnlySowDyeableSwitch';
import { GenderSelect } from './GenderSelect';

const Dialog = {
  Root,
  Backdrop,
  Positioner,
  Content,
  Title,
};

const overlayStyle = css({
  position: 'absolute',
  width: '[100%]',
  height: '[100%]',
});

const contentStyle = css({
  width: '95%',
  mt: 2,
  mx: 'auto',
  p: 4,
  minWidth: 'unset',
  borderWidth: '2px',
  borderColor: 'accent.4',
});

interface CategorySelectionDialogProps {
  children: JSX.Element;
}
export const CategorySelectionDialog = (
  props: CategorySelectionDialogProps,
) => {
  const t = useTranslate();
  const isOpen = useStore($equipmentDrawerEquipCategorySelectionOpen);

  function handleClose(_: unknown) {
    $equipmentDrawerEquipCategorySelectionOpen.set(false);
  }

  function handleOpenChange(detail: OpenChangeDetails) {
    if (!detail.open) {
      handleClose(detail);
    }
  }

  return (
    <Dialog.Root
      open={isOpen()}
      onEscapeKeyDown={handleClose}
      onOpenChange={handleOpenChange}
      closeOnInteractOutside={false}
      modal={false}
      trapFocus={false}
      preventScroll={false}
    >
      <Dialog.Backdrop
        class={overlayStyle}
        mx="-2"
        width="[calc(100% + var(--spacing-2))]"
      />
      <Dialog.Positioner class={overlayStyle} mx="auto" alignItems="flex-start">
        <Dialog.Content class={contentStyle}>
          <IconButton
            aria-label={t('common.close')}
            title={t('common.close')}
            variant="ghost"
            position="absolute"
            top="1"
            right="1"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Dialog.Title mb={2}>
            {t('tab.equipCategory')}
            <HStack>
              <OnlyShowDyeableSwitch />
              <GenderSelect />
            </HStack>
          </Dialog.Title>
          {props.children}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
