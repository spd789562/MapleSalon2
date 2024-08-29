import { Show, createMemo, splitProps } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { createEquipItemByCategory } from '@/store/character/selector';
import { getEquipById } from '@/store/string';

import CheckIcon from 'lucide-solid/icons/check';
import type { ItemProps } from '@/components/ui/toggleGroup';
import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { EllipsisText } from '@/components/ui/ellipsisText';
import {
  EquipItemIcon,
  EquipItemName,
  EquipItemInfo,
} from '@/components/drawer/CurrentEquipmentDrawer/EquipItem';

import type { EquipSubCategory } from '@/const/equipments';

type ItemChildProps = NonNullable<
  Parameters<Parameters<NonNullable<ItemProps['asChild']>>[0]>[0]
>;
export interface NeedDyeItemProps extends ItemChildProps {
  category: EquipSubCategory;
  onlyShowDyeable?: boolean;
}
export const NeedDyeItem = (props: NeedDyeItemProps) => {
  const [ownProps, buttonProps] = splitProps(props, [
    'category',
    'onlyShowDyeable',
    'class',
  ]);
  const item = useStore(createEquipItemByCategory(ownProps.category));

  const equipInfo = createMemo(() => {
    const id = item()?.id;
    if (!id) {
      return;
    }
    return getEquipById(id);
  });

  return (
    <Show when={props.onlyShowDyeable ? equipInfo()?.isDyeable : true}>
      <Show when={equipInfo()}>
        {(item) => (
          <SelectableContainer {...buttonProps}>
            <EquipItemIcon>
              <LoadableEquipIcon
                width="7"
                height="7"
                id={item().id}
                name={item().name}
                isDyeable={item().isDyeable}
              />
            </EquipItemIcon>
            <EquipItemInfo gap="0">
              <EquipItemName>
                <Show when={item().name} fallback={item().id}>
                  <EllipsisText as="div" title={item().name}>
                    {item().name}
                  </EllipsisText>
                </Show>
              </EquipItemName>
            </EquipItemInfo>
            <CheckIconContainer class="check-icon">
              <CheckIcon size=".75em" />
            </CheckIconContainer>
          </SelectableContainer>
        )}
      </Show>
    </Show>
  );
};

const SelectableContainer = styled('button', {
  base: {
    display: 'grid',
    py: '1',
    px: '2',
    borderRadius: 'md',
    // width: 'full',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer',
    borderWidth: '2px',
    borderColor: 'colorPalette.a7',
    color: 'colorPalette.text',
    colorPalette: 'gray',
    _hover: {
      background: 'colorPalette.a2',
    },
    _disabled: {
      borderColor: 'border.disabled',
      color: 'fg.disabled',
      cursor: 'not-allowed',
      _hover: {
        background: 'transparent',
        borderColor: 'border.disabled',
        color: 'fg.disabled',
      },
    },
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'colorPalette.default',
      outlineOffset: '2px',
    },
    _on: {
      borderColor: 'accent.default',
      color: 'accent.fg',
      _hover: {
        borderColor: 'accent.emphasized',
      },
      '&> .check-icon': {
        display: 'block',
      },
    },
  },
});

const CheckIconContainer = styled('div', {
  base: {
    position: 'absolute',
    right: '-1',
    top: '-1',
    backgroundColor: 'accent.default',
    display: 'none',
    borderRadius: '50%',
    padding: '0.5',
  },
});
