export enum ToolTab {
  Character = 'character',
  AllAction = 'allAction',
  HairDye = 'hairDye',
  FaceDye = 'faceDye',
  ItemDye = 'itemDye',
}

export const ToolTabNames: Record<ToolTab, string> = {
  [ToolTab.Character]: '角色預覽',
  [ToolTab.AllAction]: '全部動作',
  [ToolTab.HairDye]: '髮型顏色',
  [ToolTab.FaceDye]: '臉型顏色',
  [ToolTab.ItemDye]: '裝備染色表',
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
