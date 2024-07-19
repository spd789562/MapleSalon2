import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import {
  MAX_ZOOM,
  MIN_ZOOM,
  $previewZoom,
  resetZoom,
  resetCenter,
  addZoom,
  subtractZoom,
} from '@/store/previewZoom';

import ResetIcon from 'lucide-solid/icons/rotate-ccw';
import ViewIcon from 'lucide-solid/icons/view';
import ZoomInIcon from 'lucide-solid/icons/zoom-in';
import ZoomOutIcon from 'lucide-solid/icons/zoom-out';
import { HStack } from 'styled-system/jsx/hstack';
import { IconButton } from '@/components/ui/icon-button';

export const ZoomControl = () => {
  const currentZoom = useStore($previewZoom);

  const percent = () => Math.round(currentZoom() * 100);

  function handleResetZoom() {
    resetZoom();
  }
  function handleResetCenter() {
    resetCenter();
  }
  function handleZoomIn() {
    addZoom(0.1);
  }
  function handleZoomOut() {
    subtractZoom(0.1);
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
        title="縮小"
        disabled={currentZoom() <= MIN_ZOOM}
        onClick={handleZoomOut}
      >
        <ZoomOutIcon />
      </IconButton>
      <ZoomText>{percent()}%</ZoomText>
      <IconButton
        variant="ghost"
        size="xs"
        title="放大"
        disabled={currentZoom() >= MAX_ZOOM}
        onClick={handleZoomIn}
      >
        <ZoomInIcon />
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

const ZoomText = styled('span', {
  base: {
    px: 1,
    fontSize: 'sm',
    fontWeight: 'bold',
  },
});
