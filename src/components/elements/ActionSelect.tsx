import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { CharacterAction } from '@/const/actions';

const options = [
  {
    label: '站立',
    value: CharacterAction.Stand1,
  },
  {
    label: '坐下',
    value: CharacterAction.Sit,
  },
  {
    label: '走路',
    value: CharacterAction.Walk1,
  },
  {
    label: '跳躍',
    value: CharacterAction.Jump,
  },
  {
    label: '飛行/游泳',
    value: CharacterAction.Fly,
  },
  {
    label: '攀爬(梯子)',
    value: CharacterAction.Ladder,
  },
  {
    label: '攀爬(繩子)',
    value: CharacterAction.Rope,
  },
  {
    label: '警戒',
    value: CharacterAction.Alert,
  },
  {
    label: '施放',
    value: CharacterAction.Heal,
  },
  {
    label: '趴下',
    value: CharacterAction.Prone,
  },
  {
    label: '趴下攻擊',
    value: CharacterAction.ProneStab,
  },
  ...[
    CharacterAction.Shoot1,
    CharacterAction.Shoot2,
    CharacterAction.ShootF,
    CharacterAction.Sit,
    CharacterAction.StabO1,
    CharacterAction.StabO2,
    CharacterAction.StabOF,
    CharacterAction.StabT1,
    CharacterAction.StabT2,
    CharacterAction.StabTF,
    CharacterAction.SwingO1,
    CharacterAction.SwingO2,
    CharacterAction.SwingO3,
    CharacterAction.SwingOF,
    CharacterAction.SwingP1,
    CharacterAction.SwingP2,
    CharacterAction.SwingPF,
    CharacterAction.SwingT1,
    CharacterAction.SwingT2,
    CharacterAction.SwingT3,
    CharacterAction.SwingTF,
  ].map((value) => ({
    label: value,
    value,
  })),
];

export interface ActionSelectProps {
  value: CharacterAction;
  onValueChange: (value: CharacterAction | undefined) => void;
}
export const ActionSelect = (props: ActionSelectProps) => {
  function handleActionChange(details: ValueChangeDetails) {
    const firstItem = details.value?.[0] as CharacterAction | undefined;
    props.onValueChange(firstItem);
  }

  return (
    <SimpleSelect
      positioning={{
        sameWidth: true,
      }}
      items={options}
      value={[props.value]}
      onValueChange={handleActionChange}
      groupTitle="角色動作"
      maxHeight="20rem"
    />
  );
};
