import { Stack } from 'styled-system/jsx/stack';
import { Title } from '@/components/ui/dialog';
import { SettingDialog as Dialog } from './SettingDialog';
import { WindowSetting } from './WindowSetting';
import { ThemeSetting } from './ThemeSetting';
import { RenderSetting } from './RenderSetting';
import { OtherSetting } from './OtherSetting';
import { SettingFooter } from './SettingFooter';

export const SettingDialog = () => {
  return (
    <Dialog>
      <Stack gap="3" p="6">
        <Title fontSize="xl">設定</Title>
        <WindowSetting />
        <ThemeSetting />
        <RenderSetting />
        <OtherSetting />
        <SettingFooter />
      </Stack>
    </Dialog>
  );
};
