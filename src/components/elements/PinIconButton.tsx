import { splitProps, createSignal, Show } from 'solid-js';
import type { WritableAtom } from 'nanostores';
import { useStore } from '@nanostores/solid';

import PinIcon from 'lucide-solid/icons/pin';
import UnpinIcon from 'lucide-solid/icons/pin-off';
import { IconButton, type IconButtonProps } from '@/components/ui/icon-button';

export interface PinButtonProps extends IconButtonProps {
  /** the store here must be writeable */
  store: WritableAtom<boolean>;
}
export const PinIconButton = (props: PinButtonProps) => {
  const [isHovered, setHovered] = createSignal(false);
  const [localProps, buttonProps] = splitProps(props, ['store']);
  const isPinned = useStore(localProps.store);

  function handleClick() {
    localProps.store.set(!isPinned());
  }
  function handleHover() {
    setHovered(true);
  }
  function handleBlur() {
    setHovered(false);
  }

  return (
    <IconButton
      title={isPinned() ? '取消釘選' : '釘選'}
      {...buttonProps}
      onClick={handleClick}
      onMouseOver={handleHover}
      onMouseLeave={handleBlur}
    >
      {/* only shows when isPinned() && !isHovered()) || (!isPinned() && isHovered() */}
      <Show when={isPinned() !== isHovered()}>
        <PinIcon />
      </Show>
      {/* only shows when !isPinned() && !isHovered()) || (isPinned() && isHovered() */}
      <Show when={isPinned() === isHovered()}>
        <UnpinIcon />
      </Show>
    </IconButton>
  );
};
