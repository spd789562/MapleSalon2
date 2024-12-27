import { useTranslate, type I18nKeys } from '@/context/i18n';
import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { CharacterAction } from '@/const/actions';

const options = [
  {
    label: 'character.actionStand1',
    value: CharacterAction.Stand1,
  },
  {
    label: 'character.actionSit',
    value: CharacterAction.Sit,
  },
  {
    label: 'character.actionWalk1',
    value: CharacterAction.Walk1,
  },
  {
    label: 'character.actionJump',
    value: CharacterAction.Jump,
  },
  {
    label: 'character.actionFly',
    value: CharacterAction.Fly,
  },
  {
    label: 'character.actionLadder',
    value: CharacterAction.Ladder,
  },
  {
    label: 'character.actionRope',
    value: CharacterAction.Rope,
  },
  {
    label: 'character.actionAlert',
    value: CharacterAction.Alert,
  },
  {
    label: 'character.actionHeal',
    value: CharacterAction.Heal,
  },
  {
    label: 'character.actionProne',
    value: CharacterAction.Prone,
  },
  {
    label: 'character.actionProneStab',
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
  const t = useTranslate();

  function handleActionChange(details: ValueChangeDetails) {
    const firstItem = details.value?.[0] as CharacterAction | undefined;
    props.onValueChange(firstItem);
  }

  const _options = options.map((option) => ({
    label:
      option.value !== option.label
        ? (t(option.label as I18nKeys) as string)
        : option.label,
    value: option.value,
  }));

  return (
    <SimpleSelect
      positioning={{
        sameWidth: true,
      }}
      items={_options}
      value={[props.value]}
      onValueChange={handleActionChange}
      groupTitle="角色動作"
      maxHeight="20rem"
    />
  );
};
