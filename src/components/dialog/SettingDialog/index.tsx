import { Stack } from 'styled-system/jsx/stack';
import { Title } from '@/components/ui/dialog';
import { SettingDialog as Dialog } from './SettingDialog';
import { WindowSetting } from './WindowSetting';

export const SettingDialog = () => {
  return (
    <Dialog>
      <Stack p="6">
        <Title>設定</Title>
        <WindowSetting />
      </Stack>
    </Dialog>
  );
};
