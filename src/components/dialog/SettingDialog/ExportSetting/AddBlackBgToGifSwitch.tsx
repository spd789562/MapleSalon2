import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $addBlackBgWhenExportGif,
  setAddBlackBgWhenExportGif,
} from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';
import { GifBackgroundColorPicker } from './GifBackgroundColorPicker';

export const AddBlackBgToGifSwitch = () => {
  const t = useTranslate();
  const addBlackBgWhenExportGif = useStore($addBlackBgWhenExportGif);

  function handleChange(details: ChangeDetails) {
    setAddBlackBgWhenExportGif(details.checked);
  }

  return (
    <HStack gap="2">
      <Switch
        checked={addBlackBgWhenExportGif()}
        onCheckedChange={handleChange}
      >
        <HStack gap="1">
          <Text>{t('setting.gifWithBackground')}</Text>
          <SettingTooltip tooltip={t('setting.gitWithBackgroundTip')} />
        </HStack>
      </Switch>
      <GifBackgroundColorPicker />
    </HStack>
  );
};
