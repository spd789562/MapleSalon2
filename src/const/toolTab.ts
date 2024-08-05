export enum ToolTab {
  AllAction = 'allAction',
  HairDye = 'hairDye',
  FaceDye = 'faceDye',
}

export const ToolTabNames: Record<ToolTab, string> = {
  [ToolTab.AllAction]: '全部動作',
  [ToolTab.HairDye]: '髮型顏色',
  [ToolTab.FaceDye]: '臉型顏色',
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
