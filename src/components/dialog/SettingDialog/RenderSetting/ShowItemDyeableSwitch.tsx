import { useStore } from '@nanostores/solid';

import { $showItemDyeable, setShowItemDyeable } from '@/store/settingDialog';

import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ShowItemDyeableSwitch = () => {
  const showItemDyeable = useStore($showItemDyeable);

  function handleChange(details: ChangeDetails) {
    setShowItemDyeable(details.checked);
  }

  return (
    <Switch checked={showItemDyeable()} onCheckedChange={handleChange}>
      <Text>顯示染色標籤</Text>
    </Switch>
  );
};
