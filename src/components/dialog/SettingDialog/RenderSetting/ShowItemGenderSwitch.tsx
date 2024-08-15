import { useStore } from '@nanostores/solid';

import { $showItemGender, setShowItemGender } from '@/store/settingDialog';

import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ShowItemGenderSwitch = () => {
  const showItemGender = useStore($showItemGender);

  function handleChange(details: ChangeDetails) {
    setShowItemGender(details.checked);
  }

  return (
    <Switch checked={showItemGender()} onCheckedChange={handleChange}>
      <Text>顯示裝備性別</Text>
    </Switch>
  );
};
