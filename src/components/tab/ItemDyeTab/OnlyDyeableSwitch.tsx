import { useStore } from '@nanostores/solid';

import { $onlyShowDyeable } from '@/store/toolTab';

import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const OnlyDyeableSwitch = () => {
  const checked = useStore($onlyShowDyeable);

  function handleChange(details: ChangeDetails) {
    $onlyShowDyeable.set(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      <Text>僅顯示可染色裝備</Text>
    </Switch>
  );
};
