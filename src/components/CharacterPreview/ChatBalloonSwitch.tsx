import { useStore } from '@nanostores/solid';

import { $showChatBalloon } from '@/store/character/selector';
import { toggleShowChatBalloon } from '@/store/character/action';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ChatBalloonSwitch = () => {
  const checked = useStore($showChatBalloon);

  function handleChange(details: ChangeDetails) {
    toggleShowChatBalloon(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      顯示聊天泡泡
    </Switch>
  );
};
