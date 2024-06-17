import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $currentItem } from '@/store/character';

import { EquipHsvAdjust } from './EquipHsvAdjust';

export const EquipEdit = () => {
  const item = useStore($currentItem);

  return (
    <div>
      <p>{item()?.name}</p>
      <Show when={item()}>{(item) => <EquipHsvAdjust id={item().id} />}</Show>
    </div>
  );
};
