import { createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $mountAction, setMountAction } from '@/store/mount';

import { useMountTab } from './MountTabContext';
import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { CharacterActionNames } from '@/const/actions';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

export const MountActionSelect = () => {
  const t = useTranslate();
  const [state, _] = useMountTab();

  const action = useStore($mountAction);

  const options = useLocalizedOptions(
    createMemo(() => {
      return state.mountActions.map((action) => {
        const actionLabelHasTranslate =
          CharacterActionNames[action as keyof typeof CharacterActionNames];
        return {
          label: actionLabelHasTranslate || action,
          value: action,
        };
      });
    }),
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
      groupTitle={t('character.mountActionTitle')}
      maxHeight="20rem"
    />
  );
};
