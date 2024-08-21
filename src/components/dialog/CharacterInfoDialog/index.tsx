import { Stack } from 'styled-system/jsx/stack';
import { Box } from 'styled-system/jsx/box';
import { Title } from '@/components/ui/dialog';
import { CharacterInfoDialog as Dialog } from './CharacterInfoDialog';
import { EquipItemGrid, EquipSalonItemGrid } from './EquipItemGrid';
import { Character } from './Character';

export const CharacterInfoDialog = () => {
  return (
    <Dialog>
      <Stack gap="3" p="6">
        <Title fontSize="xl">角色資訊</Title>
        <Stack direction="row">
          <Box flex="1">
            <Character />
          </Box>
          <Stack flex="1" display="flex">
            <EquipSalonItemGrid />
          </Stack>
        </Stack>
        <Title fontSize="lg">裝備資訊</Title>
        <EquipItemGrid />
      </Stack>
    </Dialog>
  );
};
