import { splitProps, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { Portal } from 'solid-js/web';

import { $itemContextMenuTargetInfo } from '@/store/itemContextMenu';

import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import CopyIcon from 'lucide-solid/icons/copy';
import * as Menu from '@/components/ui/menu';

import { useItemContextMenu } from '@/context/itemContextMenu';

export const GlobalItemContextMenu = () => {
  const menu = useItemContextMenu();
  const itemInfo = useStore($itemContextMenuTargetInfo);

  return (
    <Menu.RootProvider value={menu} size="xs">
      <Portal>
        <Menu.Positioner zIndex="{zIndex.tooltip} !important">
          <Menu.Content>
            <Menu.ItemGroup>
              <Show when={itemInfo()?.id}>
                {(id) => (
                  <ItemContextMenuItem value="id" label={id().toString()} />
                )}
              </Show>
              <Show when={itemInfo()?.name}>
                {(name) => (
                  <ItemContextMenuItem value="name" label={name().toString()} />
                )}
              </Show>
              <Show when={itemInfo()?.icon}>
                <ItemContextMenuItem value="image" label="複製圖片" />
              </Show>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.RootProvider>
  );
};

interface ItemContextMenuItemProps extends Menu.ItemProps {
  label: string;
}
export const ItemContextMenuItem = (props: ItemContextMenuItemProps) => {
  const [localProps, itemProps] = splitProps(props, ['label']);

  return (
    <Menu.Item {...itemProps}>
      <HStack gap="4" flex="1">
        {localProps.label}
        <Box marginLeft="auto">
          <CopyIcon size={12} />
        </Box>
      </HStack>
    </Menu.Item>
  );
};
