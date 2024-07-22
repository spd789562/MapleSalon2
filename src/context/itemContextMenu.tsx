import { createContext, useContext, type JSX } from 'solid-js';
import { useMenu, type UseMenuReturn } from '@ark-ui/solid';

import {
  $itemContextMenuTargetInfo,
  clearItemContextMenuTargetInfo,
} from '@/store/itemContextMenu';

import { toaster } from '@/components/GlobalToast';
import { copyImage, copyText } from '@/utils/clipboard';

export const ItemContextMenuContext = createContext<UseMenuReturn>();

export function ItemContextMenuProvider(props: {
  children: JSX.Element;
}) {
  const menu = useMenu({
    positioning: {
      strategy: 'fixed',
    },
    onOpenChange(details) {
      if (!details.open) {
        clearItemContextMenuTargetInfo();
      }
    },
    async onSelect(details) {
      try {
        if (details.value === 'id') {
          const id = $itemContextMenuTargetInfo.get()?.id;
          id && (await copyText(id.toString()));
        } else if (details.value === 'name') {
          const name = $itemContextMenuTargetInfo.get()?.name;
          name && (await copyText(name));
        } else if (details.value === 'image') {
          const image = $itemContextMenuTargetInfo.get()?.icon;
          image && (await copyImage(image));
        }
        toaster.success({
          title: '已複製',
        });
      } catch (e) {
        toaster.error({
          title: '複製發生錯誤',
        });
      }
    },
  });

  return (
    <ItemContextMenuContext.Provider value={menu}>
      {props.children}
    </ItemContextMenuContext.Provider>
  );
}

export function useItemContextMenu() {
  const context = useContext(ItemContextMenuContext);

  if (!context) {
    throw new Error(
      'useItemContextMenu must be used within a ItemContextMenuProvider',
    );
  }

  return context;
}

export function useItemContextTrigger() {
  const menu = useItemContextMenu();
  return menu.api().getContextTriggerProps();
}
