import { createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate, useLocale } from '@/context/i18n';

import { $mountAction, setMountAction } from '@/store/mount';

import { useMountTab } from './MountTabContext';
import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { CharacterActionNames } from '@/const/actions';

export const MountActionSelect = () => {
  const t = useTranslate();
  const locale = useLocale();
  const [state, _] = useMountTab();

  const action = useStore($mountAction);

  const options = createMemo(() => {
    const _ = locale();
    return state.mountActions.map((action) => {
      const actionLabelHasTranslate =
        CharacterActionNames[action as keyof typeof CharacterActionNames];
      return {
        label: actionLabelHasTranslate
          ? (t(actionLabelHasTranslate) as string)
          : action,
        value: action,
      };
    });
  });

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
