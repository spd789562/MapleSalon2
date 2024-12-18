import { For, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $selectMapHistory,
  type MapItem,
  updateCurrentMap,
} from '@/store/mapleMap';

import ArrowLeftRightIcon from 'lucide-solid/icons/arrow-left-right';
import { Link } from '@/components/ui/link';
import { Text } from '@/components/ui/text';

export const MapSelectionHistory = () => {
  const history = useStore($selectMapHistory);

  function handleSelect(map: MapItem) {
    updateCurrentMap(map);
  }

  return (
    <>
      <For each={history()}>
        {(map) => (
          <Link
            onClick={() => handleSelect(map)}
            title={`點擊更換地圖為 ${map.name}`}
          >
            {map.name}
            <ArrowLeftRightIcon size={12} />
          </Link>
        )}
      </For>
      <Show when={history().length === 0}>
        <Text size="sm">尚無選擇紀錄</Text>
      </Show>
    </>
  );
};
