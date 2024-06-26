import { $equpimentDrawerOpen } from '@/store/trigger';

import HangerIcon from 'mingcute_icon/svg/other/coathanger_line.svg';
import { SideOpenButton } from '@/components/ui/sideOpenButton';

export const EquipOpenButton = () => {
  function handleOpen(_: unknown) {
    $equpimentDrawerOpen.set(true);
  }

  return (
    <SideOpenButton onClick={handleOpen}>
      <HangerIcon
        style={{
          width: '1.2rem',
          height: '1.2rem',
        }}
      />
    </SideOpenButton>
  );
};
