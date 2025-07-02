import { $currentEquipmentDrawerOpen } from '@/store/trigger';

import ShirtIcon from 'lucide-solid/icons/shirt';
import { SideOpenButton } from '@/components/ui/sideOpenButton';

export const CurrentEquipOpenButton = () => {
  function handleOpen(_: unknown) {
    $currentEquipmentDrawerOpen.set(true);
  }

  return (
    <SideOpenButton id="button-current-equipment-drawer-toggle" direction="left" onClick={handleOpen}>
      <ShirtIcon />
    </SideOpenButton>
  );
};
