import { CurrentEquipDrawer } from './CurrentEquipDrawer';
import { CurrentEquipList } from './CurrentEquipList';

export const CurrentEquipmentDrawer = () => {
  return (
    <CurrentEquipDrawer
      variant="left"
      header={<div />}
      body={<CurrentEquipList />}
    />
  );
};
