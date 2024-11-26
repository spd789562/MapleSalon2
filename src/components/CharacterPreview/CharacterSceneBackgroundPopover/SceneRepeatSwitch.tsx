import type { WritableAtom } from 'nanostores';
import { useStore } from '@nanostores/solid';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export interface SceneRepeatSwitchProps {
  target: WritableAtom<boolean>;
  title: string;
}
export const SceneRepeatSwitch = (props: SceneRepeatSwitchProps) => {
  const checked = useStore(props.target);

  function handleChange(details: ChangeDetails) {
    props.target.set(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      {props.title}
    </Switch>
  );
};
