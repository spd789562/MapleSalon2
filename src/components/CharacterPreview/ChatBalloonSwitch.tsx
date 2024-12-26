import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $showChatBalloon } from '@/store/character/selector';
import { toggleShowChatBalloon } from '@/store/character/action';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ChatBalloonSwitch = () => {
  const t = useTranslate();
  const checked = useStore($showChatBalloon);

  function handleChange(details: ChangeDetails) {
    toggleShowChatBalloon(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      {t('character.showChatBalloon')}
    </Switch>
  );
};
