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
