import type { LoadableEquipIconProps } from '@/components/elements/LoadableEquipIcon';
import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import type { LoadableSkillIconProps } from '@/components/elements/LoadableSkillIcon';
import { LoadableSkillIcon } from '@/components/elements/LoadableSkillIcon';
import { useEquipDrawerIconDisplaySize } from '@/hook/equipDrawerList';

export const EquipDrawerSizedIcon = (
  props: Omit<LoadableEquipIconProps, 'width' | 'height'>,
) => {
  const size = useEquipDrawerIconDisplaySize();

  return (
    <LoadableEquipIcon
      id={props.id}
      name={props.name}
      isDyeable={props.isDyeable}
      folder={props.folder}
      width={size()}
      height={size()}
      fill
    />
  );
};

export const EquipDrawerSizedSkillIcon = (
  props: Omit<LoadableSkillIconProps, 'width' | 'height'>,
) => {
  const size = useEquipDrawerIconDisplaySize();

  return (
    <LoadableSkillIcon
      id={props.id}
      name={props.name}
      folder={props.folder}
      isSkill={props.isSkill}
      width={size()}
      height={size()}
      fill
    />
  );
};
