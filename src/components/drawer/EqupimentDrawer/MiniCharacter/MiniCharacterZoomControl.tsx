import { useTranslate } from '@/context/i18n';

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
  const t = useTranslate();

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
        title={t('scene.resetZoom')}
        onClick={handleResetZoom}
      >
        <ResetIcon />
      </IconButton>
      <IconButton
        variant="ghost"
        size="xs"
        title={t('scene.resetPosition')}
        onClick={handleResetCenter}
      >
        <ViewIcon />
      </IconButton>
    </HStack>
  );
};
