import { useTranslate } from '@/context/i18n';

import { Stack } from 'styled-system/jsx/stack';
import { Title } from '@/components/ui/dialog';
import { SettingDialog as Dialog } from './SettingDialog';
import { LanguageSelect } from './LanguageSelect';
import { WindowSetting } from './WindowSetting';
import { ThemeSetting } from './ThemeSetting';
import { RenderSetting } from './RenderSetting';
import { ExportSetting } from './ExportSetting';
import { OtherSetting } from './OtherSetting';
import { SettingFooter } from './SettingFooter';

export const SettingDialog = () => {
  const t = useTranslate();
  return (
    <Dialog>
      <Stack gap="3" p="6">
        <Title fontSize="xl">{t('setting.title')}</Title>
        <LanguageSelect />
        <WindowSetting />
        <ThemeSetting />
        <ExportSetting />
        <RenderSetting />
        <OtherSetting />
        <SettingFooter />
      </Stack>
    </Dialog>
  );
};
