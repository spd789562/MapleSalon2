import { splitProps, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { HStack } from 'styled-system/jsx';
import * as Menu from '@/components/ui/menu';

export interface CharacterActionMenuProps extends Menu.RootProps {
  name: string;
  children?: JSX.Element;
}
export const CharacterActionMenu = (props: CharacterActionMenuProps) => {
  const [localProps, rootProps] = splitProps(props, ['name', 'children']);
  return (
    <Menu.Root {...rootProps}>
      <Portal>
        <Menu.Positioner zIndex={1800} style={{ '--z-index': '1800' }}>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>{localProps.name}</Menu.ItemGroupLabel>
              <Menu.Separator />
              <Menu.Item value="detail">
                <HStack gap="2">Detail</HStack>
              </Menu.Item>
              <Menu.Item value="billing">
                <HStack gap="2">Clone</HStack>
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item value="delete">
                <HStack gap="2">Delete</HStack>
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
