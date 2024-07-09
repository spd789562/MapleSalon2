import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $characterSelectionDrawerOpen } from '@/store/trigger';

import ChevronDownIcon from 'lucide-solid/icons/chevron-down';
import { TopBarPositioner, TopBarToggle } from '@/components/ui/topBarToggle';

export const CharacterSelectionDrawerOpenButton = () => {
  const isOpen = useStore($characterSelectionDrawerOpen);

  const handleToggle = () => {
    $characterSelectionDrawerOpen.set(!$characterSelectionDrawerOpen.get());
  };

  return (
    <Portal>
      <TopBarPositioner data-state={isOpen() ? 'open' : 'close'}>
        <TopBarToggle onClick={handleToggle}>
          角色選單
          <ChevronDownIcon size={24} />
        </TopBarToggle>
      </TopBarPositioner>
    </Portal>
  );
};
