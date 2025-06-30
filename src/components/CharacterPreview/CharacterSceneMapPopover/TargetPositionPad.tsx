import { createEffect, createSignal, untrack } from 'solid-js';
import { createRAF } from '@solid-primitives/raf';
import { useKeyDownList } from '@solid-primitives/keyboard';
import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';
import { styled } from 'styled-system/jsx/factory';

import {
  $mapTargetPosX,
  $mapTargetPosY,
  $currentMapRect,
  updateMapTargetPos,
} from '@/store/mapleMap';

const MoveFactor = {
  ARROWUP: { x: 0, y: -0.5 },
  ARROWDOWN: { x: 0, y: 0.5 },
  ARROWLEFT: { x: -0.5, y: 0 },
  ARROWRIGHT: { x: 0.5, y: 0 },
};
const LONG_PRESS_TIME = 200;

export interface TargetPositionPadProps {
  onStartMove?: () => void;
  onEndMove?: () => void;
}

export const TargetPositionPad = (props: TargetPositionPadProps) => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [isKeyDown, setIsKeyDown] = createSignal(false);
  const [boundRectWidth, setBoundRectWidth] = createSignal('100%');
  const [boundRectHeight, setBoundRectHeight] = createSignal('100%');
  const [translate, setTranslate] = createSignal({ x: 0, y: 0 });
  const [relativeRect, setRelativeRect] = createSignal({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const targetPosX = useStore($mapTargetPosX);
  const targetPosY = useStore($mapTargetPosY);
  const mapRect = usePureStore($currentMapRect);
  const keydowns = useKeyDownList();
  const [running, start, stop] = createRAF(handleKeyDownContinue);

  let longPressTimer = 0;
  let relativeContainer!: HTMLDivElement;

  function refreshRect() {
    const rect = relativeContainer.getBoundingClientRect();
    setRelativeRect({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
  }

  function handleMoveTarget(x: number, y: number) {
    const { width, height } = relativeRect();
    const clampX = Math.max(0, Math.min(width, x));
    const clampY = Math.max(0, Math.min(height, y));
    setTranslate({ x: clampX, y: clampY });
    const rect = mapRect();

    const px = (clampX / width) * rect.width + rect.x;
    const py = (clampY / height) * rect.height + rect.y;
    updateMapTargetPos(px, py);
  }

  /* arrow keys move */
  function handleKeyDownContinue() {
    if (!isKeyDown()) {
      return;
    }
    longPressTimer += 16;
    if (longPressTimer < LONG_PRESS_TIME && longPressTimer > 16) {
      return;
    }
    const factor = { x: 0, y: 0 };
    for (const k of keydowns()) {
      const f = MoveFactor[k as keyof typeof MoveFactor] ?? { x: 0, y: 0 };
      factor.x += f.x;
      factor.y += f.y;
    }
    const currentTranslate = translate();
    handleMoveTarget(
      currentTranslate.x + factor.x,
      currentTranslate.y + factor.y,
    );
  }
  function handleKeyDown(event: KeyboardEvent) {
    if (isDragging()) {
      setIsDragging(false);
    }
    if (event.key?.startsWith('Arrow') && !isKeyDown()) {
      refreshRect();
      setIsKeyDown(true);
      start();
      props.onStartMove?.();
    }
  }
  function handleKeyUp(event: KeyboardEvent) {
    const anyArrows = keydowns().some(
      (k) => k.startsWith('ARROW') && k !== event.key.toUpperCase(),
    );
    if (anyArrows) {
      return;
    }
    if (isKeyDown()) {
      longPressTimer = 0;
      setIsKeyDown(false);
      props.onEndMove?.();
    }
    if (running()) {
      stop();
    }
  }

  /* mouse drag */
  function handleMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    const { left, top } = relativeRect();
    const tx = x - left;
    const ty = y - top;
    handleMoveTarget(tx, ty);
  }
  function handleMove(event: MouseEvent) {
    if (isDragging()) {
      handleMouseMove(event);
    }
  }
  function handleStartDrag(event: MouseEvent) {
    refreshRect();
    setIsDragging(true);
    handleMouseMove(event);
    props.onStartMove?.();
  }
  function handleEndDrag() {
    setIsDragging(false);
    props.onEndMove?.();
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
    setTimeout(refreshRect, 0);
  });
  createEffect(() => {
    const x = targetPosX();
    const y = targetPosY();
    const rect = untrack(() => mapRect());
    const { width, height } = relativeContainer.getBoundingClientRect();

    const px = ((x - rect.x) / rect.width) * width;
    const py = ((y - rect.y) / rect.height) * height;
    setTranslate({ x: px, y: py });
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
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          style={{
            transform: `translate(${translate().x}px, ${translate().y}px)`,
          }}
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
    borderColor: 'gray.6',
  },
});

const MapBoundRect = styled('div', {
  base: {
    border: '1px solid',
    borderColor: 'colorPalette.6',
    backgroundColor: 'colorPalette.2',
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
    borderColor: 'colorPalette.8',
    width: 2,
    height: 2,
    top: -1,
    left: -1,
    cursor: 'pointer',
  },
});
