import ResetIcon from 'lucide-solid/icons/rotate-ccw';
import ViewIcon from 'lucide-solid/icons/view';
import { HStack } from 'styled-system/jsx/hstack';
import { IconButton } from '@/components/ui/icon-button';

interface MiniCharacterZoomControlProps {
  resetZoom: () => void;
  resetCenter: () => void;
}
export const MiniCharacterZoomControl = (
  props: MiniCharacterZoomControlProps,
) => {
  function handleResetZoom() {
    props.resetZoom();
  }
  function handleResetCenter() {
    props.resetCenter();
  }

  return (
    <HStack gap={1}>
      <IconButton
        variant="ghost"
        size="xs"
        title="重製縮放"
        onClick={handleResetZoom}
      >
        <ResetIcon />
      </IconButton>
      <IconButton
        variant="ghost"
        size="xs"
        title="重製角色位置"
        onClick={handleResetCenter}
      >
        <ViewIcon />
      </IconButton>
    </HStack>
  );
};
