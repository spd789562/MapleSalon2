/** Matches the default right-drawer width (`sizes.sm`). */
export const DEFAULT_EQUIP_DRAWER_WIDTH = 384;
export const DEFAULT_ICON_COLUMNS = 7;
export const DEFAULT_CHARACTER_COLUMNS = 5;
export const ICON_COLUMN_WIDTH = 48;
export const CHARACTER_COLUMN_WIDTH = 80;
export const MAX_EQUIP_DRAWER_EXTRA_COLUMNS = 13;
/** Pointer must move this far before resize starts. */
export const EQUIP_DRAWER_RESIZE_THRESHOLD = 14;

export function clampEquipDrawerExtraColumns(extra: number) {
  const maxByViewport = Math.max(
    0,
    Math.floor(
      (window.innerWidth * 0.75 - DEFAULT_EQUIP_DRAWER_WIDTH) /
        ICON_COLUMN_WIDTH,
    ),
  );
  const max = Math.min(MAX_EQUIP_DRAWER_EXTRA_COLUMNS, maxByViewport);
  return Math.max(0, Math.min(Math.round(extra), max));
}

export function getEquipDrawerWidth(extraColumns: number) {
  return DEFAULT_EQUIP_DRAWER_WIDTH + extraColumns * ICON_COLUMN_WIDTH;
}

export function getIconColumnCount(extraColumns: number) {
  return DEFAULT_ICON_COLUMNS + extraColumns;
}

export function getCharacterColumnCount(extraColumns: number) {
  return (
    DEFAULT_CHARACTER_COLUMNS +
    Math.floor((extraColumns * ICON_COLUMN_WIDTH) / CHARACTER_COLUMN_WIDTH)
  );
}
