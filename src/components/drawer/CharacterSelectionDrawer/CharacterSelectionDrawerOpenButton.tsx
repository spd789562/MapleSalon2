import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import {
  $characterSelectionDrawerOpen,
  $settingDialogOpen,
} from '@/store/trigger';

import ChevronDownIcon from 'lucide-solid/icons/chevron-down';
import SettingIcon from 'lucide-solid/icons/settings';
import { TopBarPositioner, TopBarToggle } from '@/components/ui/topBarToggle';
import { IconButton } from '@/components/ui/icon-button';

export const CharacterSelectionDrawerOpenButton = () => {
  const isOpen = useStore($characterSelectionDrawerOpen);

  function handleToggle() {
    $characterSelectionDrawerOpen.set(!$characterSelectionDrawerOpen.get());
  }

  function handleClickSetting(event: Event) {
    event.stopPropagation();
    $settingDialogOpen.set(true);
  }

  return (
    <Portal>
      <TopBarPositioner data-state={isOpen() ? 'open' : 'close'}>
        <TopBarToggle onClick={handleToggle}>
          <IconButton
            onClick={handleClickSetting}
            variant="ghost"
            size="sm"
            marginLeft="-1"
          >
            <SettingIcon size={24} style={{ 'margin-left': 'unset' }} />
          </IconButton>
          <span>角色選單</span>
          <ChevronDownIcon size={24} />
        </TopBarToggle>
      </TopBarPositioner>
    </Portal>
  );
};
