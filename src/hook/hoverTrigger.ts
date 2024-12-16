import { createSignal } from 'solid-js';

interface HoverTriggerProps {
  delay?: number;
}
export function useHoverTrigger(props: HoverTriggerProps) {
  let hoverTimer: number | null = null;
  const [isOpen, setIsOpen] = createSignal(false);
  const onHover = () => {
    if (isOpen()) {
      return;
    }
    hoverTimer && clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      setIsOpen(true);
    }, props.delay);
  };
  const resetHoverTimer = () => {
    hoverTimer && clearTimeout(hoverTimer);
  };
  const onOutsideClick = () => {
    setIsOpen(false);
  };
  return { isOpen, onHover, resetHoverTimer, onOutsideClick };
}
