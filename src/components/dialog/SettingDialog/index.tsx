import { Stack } from 'styled-system/jsx/stack';
import { Title } from '@/components/ui/dialog';
import { SettingDialog as Dialog } from './SettingDialog';
import { WindowSetting } from './WindowSetting';
import { ThemeSetting } from './ThemeSetting';
import { RenderSetting } from './RenderSetting';

export const SettingDialog = () => {
  return (
    <Dialog>
      <Stack p="6">
        <Title fontSize="xl">設定</Title>
        <WindowSetting />
        <ThemeSetting />
        <RenderSetting />
      </Stack>
    </Dialog>
  );
};
