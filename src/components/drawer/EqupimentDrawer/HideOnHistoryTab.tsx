import { Show, type JSX } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $isOnHistoryTab } from '@/store/equipDrawer';

export interface HideOnHistoryTabProps {
  children: JSX.Element;
}
export const HideOnHistoryTab = (props: HideOnHistoryTabProps) => {
  const onHistoryTab = useStore($isOnHistoryTab);

  return <Show when={!onHistoryTab()}>{props.children}</Show>;
};
