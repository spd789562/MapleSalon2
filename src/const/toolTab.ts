import type { I18nKeys } from '@/context/i18n';

export enum ToolTab {
  Character = 'character',
  AllAction = 'allAction',
  HairDye = 'hairDye',
  FaceDye = 'faceDye',
  ItemDye = 'itemDye',
  Chair = 'chair',
  Mount = 'mount',
  Skill = 'skill',
}

export const ToolTabNames: Record<ToolTab, I18nKeys> = {
  [ToolTab.Character]: 'tab.characterPreview',
  [ToolTab.AllAction]: 'tab.allAction',
  [ToolTab.HairDye]: 'tab.hairColor',
  [ToolTab.FaceDye]: 'tab.faceColor',
  [ToolTab.ItemDye]: 'tab.equipDye',
  [ToolTab.Chair]: 'tab.chairPreview',
  [ToolTab.Mount]: 'tab.mountPreview',
  [ToolTab.Skill]: 'tab.skillPreview',
};

export enum ActionExportType {
  Gif = 'gif',
  Apng = 'apng',
  Webp = 'webp',
}

export const ActionExportTypeExtensions: Record<ActionExportType, string> = {
  [ActionExportType.Gif]: '.gif',
  [ActionExportType.Apng]: '.png',
  [ActionExportType.Webp]: '.webp',
};

export const ActionExportTypeMimeType: Record<ActionExportType, string> = {
  [ActionExportType.Gif]: 'image/gif',
  [ActionExportType.Apng]: 'image/png',
  [ActionExportType.Webp]: 'image/webp',
};

export enum DyeOrder {
  Up = 'up',
  Down = 'down',
}
export enum DyeType {
  Hue = 'hue',
  Saturation = 'saturation',
  Birghtness = 'brightness',
}

export function isValidExportType(type: string): type is ActionExportType {
  return type in ActionExportTypeExtensions;
}
