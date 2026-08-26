import { Index, onCleanup } from 'solid-js';
import { css } from 'styled-system/css';

import { $equipmentDrawerExtraColumns, $equipmentDrawerResizing } from '@/store/equipDrawer';
import { saveSetting } from '@/store/settingDialog';
import {
  clampEquipDrawerExtraColumns,
  EQUIP_DRAWER_RESIZE_THRESHOLD,
  ICON_COLUMN_WIDTH,
} from '@/const/equipDrawer';

import { useTranslate } from '@/context/i18n';

import GripVerticalIcon from 'lucide-solid/icons/grip-vertical';

const HANDLE_COUNT = 3;

export const EquipDrawerResizeHandle = () => {
  const t = useTranslate();
  let pointerId: number | null = null;
  let startX = 0;
  let startExtra = 0;
  let activated = false;

  function resetDrag() {
    pointerId = null;
    activated = false;
    $equipmentDrawerResizing.set(false);
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
  }

  function handlePointerDown(event: PointerEvent) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    pointerId = event.pointerId;
    startX = event.clientX;
    startExtra = $equipmentDrawerExtraColumns.get();
    activated = false;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    document.body.style.userSelect = 'none';
  }

  function handlePointerMove(event: PointerEvent) {
    if (pointerId !== event.pointerId) {
      return;
    }
    const delta = startX - event.clientX;
    if (!activated) {
      if (Math.abs(delta) < EQUIP_DRAWER_RESIZE_THRESHOLD) {
        return;
      }
      activated = true;
      $equipmentDrawerResizing.set(true);
      document.body.style.cursor = 'col-resize';
    }
    const extra = clampEquipDrawerExtraColumns(startExtra + delta / ICON_COLUMN_WIDTH);
    if (extra !== $equipmentDrawerExtraColumns.get()) {
      $equipmentDrawerExtraColumns.set(extra);
    }
  }

  async function handlePointerUp(event: PointerEvent) {
    if (pointerId !== event.pointerId) {
      return;
    }
    const didResize = activated;
    resetDrag();

    if (didResize) {
      await saveSetting();
    }
  }

  function handleDoubleClick() {
    if ($equipmentDrawerExtraColumns.get() === 0) {
      return;
    }
    $equipmentDrawerExtraColumns.set(0);
    saveSetting();
  }

  onCleanup(() => {
    resetDrag();
  });

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={t('common.resizeEquipDrawer')}
      title={t('common.resizeEquipDrawer')}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDblClick={handleDoubleClick}
      class={css({
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        zIndex: 'docked',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '3',
        py: '10',
        color: 'fg.muted',
        opacity: 0.2,
        cursor: 'col-resize',
        touchAction: 'none',
        _hover: {
          opacity: 1,
          color: 'fg.default',
          backgroundColor: 'bg.muted',
        },
        _active: {
          opacity: 1,
          backgroundColor: 'bg.muted',
        },
      })}
      tabIndex={0}
    >
      <Index each={Array.from({ length: HANDLE_COUNT })}>
        {() => (
          <div
            class={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4',
              height: '8',
              borderRadius: 'sm',
              borderWidth: '1px',
              borderColor: 'border.muted',
              backgroundColor: 'bg.default',
              color: 'inherit',
            })}
          >
            <GripVerticalIcon size={12} />
          </div>
        )}
      </Index>
    </div>
  );
};
