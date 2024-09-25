import { HStack } from 'styled-system/jsx/hstack';
import { CurrentEquipDrawer } from './CurrentEquipDrawer';
import { CurrentEquipDrawerTabs } from './CurrentEquipDrawerTabs';
import { CurrentEquipList } from './CurrentEquipList';

export const CurrentEquipmentDrawer = () => {
  return (
    <CurrentEquipDrawer
      header={
        <HStack mt="-4" mb="-2" mx="-2">
          <CurrentEquipDrawerTabs />
        </HStack>
      }
      variant="left"
    >
      <CurrentEquipList />
    </CurrentEquipDrawer>
  );
};
