import { createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $mountAction, setMountAction } from '@/store/mount';

import { useMountTab } from './MountTabContext';
import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { CharacterActionNames } from '@/const/actions';

export const MountActionSelect = () => {
  const [state, _] = useMountTab();

  const action = useStore($mountAction);

  const options = createMemo(() =>
    state.mountActions.map((action) => ({
      label:
        CharacterActionNames[action as keyof typeof CharacterActionNames] ||
        action,
      value: action,
    })),
  );

  function handleActionChange(details: ValueChangeDetails) {
    details.value?.[0] && setMountAction(details.value[0] as string);
  }

  return (
    <SimpleSelect
      positioning={{
        sameWidth: true,
      }}
      items={options()}
      value={[action()]}
      onValueChange={handleActionChange}
      groupTitle="坐騎動作"
      maxHeight="20rem"
    />
  );
};
