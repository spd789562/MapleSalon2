import { splitProps, Show, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { HStack } from 'styled-system/jsx/hstack';
import InfoIcon from 'lucide-solid/icons/info';
import CopyIcon from 'lucide-solid/icons/copy';
import ArrowDownToLineIcon from 'lucide-solid/icons/arrow-down-to-line';
import Trash2Icon from 'lucide-solid/icons/trash-2';
import * as Menu from '@/components/ui/menu';
import { Kbd } from '@/components/ui/kbd';

export interface CharacterActionMenuProps extends Menu.RootProps {
  name: string;
  children?: JSX.Element;
}
export const CharacterActionMenu = (props: CharacterActionMenuProps) => {
  const [localProps, rootProps] = splitProps(props, ['name', 'children']);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'i') {
      // rootProps.onSelect?.({ value: 'detail' });
    } else if (e.key === 'c') {
      rootProps.onSelect?.({ value: 'clone' });
    } else if (e.key === 'Delete') {
      rootProps.onSelect?.({ value: 'delete' });
    }
  }

  return (
    <Menu.Root
      {...rootProps}
      positioning={{
        strategy: 'fixed',
      }}
    >
      <Menu.Trigger>{localProps.children}</Menu.Trigger>
      <Portal>
        <Menu.Positioner zIndex="{zIndex.topDrawerContextMenu} !important">
          <Menu.Content onKeyDown={handleKeyDown}>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>{localProps.name}</Menu.ItemGroupLabel>
              <Menu.Separator />
              {/* <CharacterActionMenuItem
                value="detail"
                icon={<InfoIcon size={12} />}
                label="詳細資訊"
                keybind="I"
                keybindPx="2"
              /> */}
              <CharacterActionMenuItem
                value="clone"
                icon={<CopyIcon size={12} />}
                label="複製"
                keybind="C"
                keybindPx="1"
              />
              <CharacterActionMenuItem
                value="download"
                icon={<ArrowDownToLineIcon size={12} />}
                label="下載"
              />
              <Menu.Separator />
              <CharacterActionMenuItem
                value="delete"
                icon={<Trash2Icon size={12} />}
                label="刪除"
                keybind="Delete"
              />
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

interface CharacterActionMenuItemProps extends Menu.ItemProps {
  icon?: JSX.Element;
  label: string;
  keybind?: string;
  keybindPx?: string;
}
export const CharacterActionMenuItem = (
  props: CharacterActionMenuItemProps,
) => {
  const [localProps, itemProps] = splitProps(props, [
    'icon',
    'label',
    'keybind',
  ]);

  return (
    <Menu.Item {...itemProps}>
      <HStack gap="4" flex="1">
        <HStack gap="2">
          {localProps.icon}
          {localProps.label}
        </HStack>
        <Show when={localProps.keybind}>
          <Kbd marginLeft="auto" size="sm" px={props.keybindPx}>
            {localProps.keybind}
          </Kbd>
        </Show>
      </HStack>
    </Menu.Item>
  );
};
