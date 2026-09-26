/** Matches the default right-drawer width (`sizes.sm`). */
export const DEFAULT_EQUIP_DRAWER_WIDTH = 384;
export const DEFAULT_ICON_COLUMNS = 7;
/** Pointer must move this far before resize starts. */
export const EQUIP_DRAWER_RESIZE_THRESHOLD = 14;

export enum EquipDrawerItemSize {
  Small = 'small',
  Medium = 'medium',
  Big = 'big',
  ExtraBig = 'extraBig',
}

export const EQUIP_DRAWER_ICON_SIZE_CONFIG = {
  [EquipDrawerItemSize.Small]: {
    columnWidth: 48,
    rowHeight: 48,
    displaySize: 36,
  },
  [EquipDrawerItemSize.Medium]: {
    columnWidth: 56,
    rowHeight: 56,
    displaySize: 42,
  },
  [EquipDrawerItemSize.Big]: {
    columnWidth: 64,
    rowHeight: 64,
    displaySize: 48,
  },
  [EquipDrawerItemSize.ExtraBig]: {
    columnWidth: 72,
    rowHeight: 72,
    displaySize: 54,
  },
} as const;

export const EQUIP_DRAWER_CHARACTER_SIZE_CONFIG = {
  [EquipDrawerItemSize.Small]: {
    columnWidth: 64,
    rowHeight: 72,
  },
  [EquipDrawerItemSize.Medium]: {
    columnWidth: 80,
    rowHeight: 90,
  },
  [EquipDrawerItemSize.Big]: {
    columnWidth: 112,
    rowHeight: 126,
  },
  [EquipDrawerItemSize.ExtraBig]: {
    columnWidth: 112,
    rowHeight: 126,
  },
} as const;

export const EQUIP_DRAWER_CHROME_WIDTH =
  DEFAULT_EQUIP_DRAWER_WIDTH -
  DEFAULT_ICON_COLUMNS *
    EQUIP_DRAWER_ICON_SIZE_CONFIG[EquipDrawerItemSize.Small].columnWidth;

export type EquipDrawerIconSizeConfig =
  (typeof EQUIP_DRAWER_ICON_SIZE_CONFIG)[EquipDrawerItemSize];
export type EquipDrawerCharacterSizeConfig =
  (typeof EQUIP_DRAWER_CHARACTER_SIZE_CONFIG)[EquipDrawerItemSize];

export function isValidEquipDrawerItemSize(
  value: unknown,
): value is EquipDrawerItemSize {
  return (
    value === EquipDrawerItemSize.Small ||
    value === EquipDrawerItemSize.Medium ||
    value === EquipDrawerItemSize.Big ||
    value === EquipDrawerItemSize.ExtraBig
  );
}

export function getEquipDrawerIconSizeConfig(
  size: EquipDrawerItemSize,
): EquipDrawerIconSizeConfig {
  return EQUIP_DRAWER_ICON_SIZE_CONFIG[size];
}

export function getEquipDrawerCharacterSizeConfig(
  size: EquipDrawerItemSize,
): EquipDrawerCharacterSizeConfig {
  return EQUIP_DRAWER_CHARACTER_SIZE_CONFIG[size];
}

export function clampEquipDrawerExtraColumns(
  extra: number,
  iconColumnWidth: number,
) {
  const maxColumns = Math.max(
    DEFAULT_ICON_COLUMNS,
    Math.floor(
      (window.innerWidth * 0.75 - EQUIP_DRAWER_CHROME_WIDTH) / iconColumnWidth,
    ),
  );
  const maxExtra = maxColumns - DEFAULT_ICON_COLUMNS;
  return Math.max(0, Math.min(Math.round(extra), maxExtra));
}

export function getEquipDrawerWidth(
  extraColumns: number,
  iconColumnWidth: number,
) {
  return (
    EQUIP_DRAWER_CHROME_WIDTH +
    (DEFAULT_ICON_COLUMNS + extraColumns) * iconColumnWidth
  );
}

export function getIconColumnCount(extraColumns: number) {
  return DEFAULT_ICON_COLUMNS + extraColumns;
}

export function getCharacterColumnCount(
  extraColumns: number,
  iconColumnWidth: number,
  characterColumnWidth: number,
) {
  const contentWidth = (DEFAULT_ICON_COLUMNS + extraColumns) * iconColumnWidth;
  return Math.max(1, Math.floor(contentWidth / characterColumnWidth));
}

export function extraColumnsForPreservedWidth(
  previousWidth: number,
  newIconColumnWidth: number,
) {
  const nextExtra =
    Math.round(
      (previousWidth - EQUIP_DRAWER_CHROME_WIDTH) / newIconColumnWidth,
    ) - DEFAULT_ICON_COLUMNS;
  return clampEquipDrawerExtraColumns(nextExtra, newIconColumnWidth);
}
