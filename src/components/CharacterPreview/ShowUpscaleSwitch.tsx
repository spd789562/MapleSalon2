import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $enableExperimentalUpscale } from '@/store/settingDialog';
import { $showUpscaledCharacter } from '@/store/trigger';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ShowUpscaleSwitch = () => {
  const t = useTranslate();
  const isEnable = useStore($enableExperimentalUpscale);
  const isShow = useStore($showUpscaledCharacter);

  function handleChange(details: ChangeDetails) {
    $showUpscaledCharacter.set(details.checked);
  }

  return (
    <Show when={isEnable()}>
      <Switch checked={isShow()} onCheckedChange={handleChange}>
        {t('setting.applyUpscale')}
      </Switch>
    </Show>
  );
};
