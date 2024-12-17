import { createEffect, createSignal, untrack } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';
import { styled } from 'styled-system/jsx/factory';

import {
  $mapTargetPosX,
  $mapTargetPosY,
  $currentMapRect,
  updateMapTargetPos,
} from '@/store/mapleMap';

export const TargetPositionPad = () => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [boundRectWidth, setBoundRectWidth] = createSignal('100%');
  const [boundRectHeight, setBoundRectHeight] = createSignal('100%');
  const [translate, setTranslate] = createSignal('translate(0%, 0%)');
  const targetPosX = useStore($mapTargetPosX);
  const targetPosY = useStore($mapTargetPosY);
  const mapRect = usePureStore($currentMapRect);

  let relativeContainer!: HTMLDivElement;

  function handleMouseMove(event: MouseEvent) {
    const rect = mapRect();
    const x = event.clientX;
    const y = event.clientY;
    const { left, top, width, height } =
      relativeContainer.getBoundingClientRect();
    const tx = x - left;
    const ty = y - top;
    const clampX = Math.max(0, Math.min(width, tx));
    const clampY = Math.max(0, Math.min(height, ty));

    setTranslate(`translate(${clampX}px, ${clampY}px)`);

    const px = (clampX / width) * rect.width + rect.x;
    const py = (clampY / height) * rect.height + rect.y;
    updateMapTargetPos(px, py);
  }

  function handleMove(event: MouseEvent) {
    if (isDragging()) {
      handleMouseMove(event);
    }
  }

  function handleEndDrag() {
    setIsDragging(false);
  }

  function handleStartDrag(event: MouseEvent) {
    setIsDragging(true);
    handleMouseMove(event);
  }

  createEffect(() => {
    const rect = mapRect();
    const ratio = rect.width / rect.height;
    if (ratio > 16 / 9) {
      setBoundRectWidth('100%');
      setBoundRectHeight(`${(rect.height / rect.width) * 100}%`);
    } else {
      setBoundRectWidth(`${(rect.height / rect.width) * 100}%`);
      setBoundRectHeight('100%');
    }
  });
  createEffect(() => {
    const x = targetPosX();
    const y = targetPosY();
    const rect = untrack(() => mapRect());
    const { width, height } = relativeContainer.getBoundingClientRect();

    const px = ((x - rect.x) / rect.width) * width;
    const py = ((y - rect.y) / rect.height) * height;
    setTranslate(`translate(${px}px, ${py}px)`);
  });

  return (
    <TargetPositionPadContainer>
      <MapBoundRect
        ref={relativeContainer}
        onMouseDown={handleStartDrag}
        onMouseMove={handleMove}
        onMouseLeave={handleEndDrag}
        onMouseUp={handleEndDrag}
        style={{ width: boundRectWidth(), height: boundRectHeight() }}
      >
        <TargetPositionDot
          role="button"
          onMouseDown={handleStartDrag}
          onMouseUp={handleEndDrag}
          style={{ transform: translate() }}
        />
      </MapBoundRect>
    </TargetPositionPadContainer>
  );
};

const TargetPositionPadContainer = styled('div', {
  base: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'gray.3',
  },
});

const MapBoundRect = styled('div', {
  base: {
    border: '1px solid',
    borderColor: 'accent.6',
    backgroundColor: 'accent.2',
    position: 'absolute',
    borderRadius: 'sm',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

const TargetPositionDot = styled('button', {
  base: {
    position: 'absolute',
    border: '2px solid',
    borderRadius: '50%',
    borderColor: 'accent.8',
    width: 2,
    height: 2,
    top: -1,
    left: -1,
    cursor: 'pointer',
  },
});
