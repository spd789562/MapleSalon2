export const dict = {
  save: '儲存',
  saveSuccess: '儲存成功',
  saveAsNew: '另存為新角色',
  saveCharacterSuccess: '角色已儲存',
  saveAsNewCharacterSuccess: '已另存為新角色',
  cancel: '取消',
  cancelChanges: '取消變更',
  cancelChangesDesc: '此操作無法返回，確定要取消變更？',
  cancelCharacterChanges: '取消任何角色變更至為儲存的樣子',
  abandonCharacterChanges: '捨棄變更',
  abandonCharacterChangesDesc: '當前變更尚未儲存，是否捨棄變更？',
  abandonCharacterChangesTitle: '確認捨棄未儲存變更',
  upload: '上傳',
  uploadFailed: '上傳失敗',
  uploadCharacter: '上傳角色',
  fileFormatError: '檔案格式錯誤',
  newCharacter: '新增角色',
  openCrrentEquipment: '查看當前裝備',
  applyUpscale: '套用高清化',
  showCompare: '顯示比對',
  refreshPage: '重新載入頁面',
  refreshNow: '立即重整',
  refreshLater: '稍後重整',

  open: '開啟設定視窗',
  title: '設定',

  language: '語言',
  selectLanguage: '選擇語言',

  windowTitle: '視窗設定',
  freeResize: '自由調整視窗大小',
  resolution: '解析度',
  scale: '縮放',
  scaleConfirm: '變更縮放',
  scaleConfirmDesc:
    '此設定過大時可能導致無法正常顯示，確認是否變更縮放至 {{resolution}}？',
  apply: '套用',

  themeTitle: '主題設定',
  theme: '主題',
  color: '色彩模式',
  colorLight: '明亮模式',
  colorDark: '暗色模式',
  colorSystem: '系統',

  exportTitle: '匯出設定',
  frameRemainSpace: '匯出分鏡時填補空白',
  frameRemainSpaceTip:
    '分鏡將會統一角色圖片大小，以利播放，若取消勾選時，匯出的 zip 將會含有每張分鏡角色定位的 json 檔',
  gifWithBackground: 'Gif 背景色',
  gitWithBackgroundTip:
    '此設定將會使匯出的 Gif 有背景色，改善部分裝備為半透明時會導致匯出時黑時白的問題',

  renderTitle: '渲染設定',
  renderer: '渲染器',
  rendererTip:
    '預設為 WebGPU ，部份情況會無法自動判定導致渲染失敗。此設定變更後須重整頁面',
  changeRendererConfirm: '變更渲染器',
  changeRendererConfirmDesc:
    '頁面需要重新載入以套用新的渲染器設定，請問是否立即重整頁面？',
  scaleMode: '縮放模式',
  scaleModeTip:
    '預設為平滑，更改至點陣將於縮放時保留點陣效果。此設定變更後須重整頁面',
  scaleModeLinear: '平滑',
  scaleModeNearest: '點陣',
  scaleModeConfirm: '變更縮放模式',
  scaleModeConfirmDesc:
    '頁面需要重新載入以套用新的縮放設定，請問是否立即重整頁面？',
  experimentalUpscale: '實驗性高清預覽',
  experimentalUpscaleTip:
    '新增按鈕顯示高清化的角色預覽，開啟時顯示高清版(Anime4K)的角色預覽，此功能可能造成一些效能影響，請確認有足夠的電腦資源再使用',
  characterRender: '角色渲染',
  characterRenderTip:
    '將髮型/臉型直接渲染成角色，可以有較佳的預覽體驗，但可能造成大量記憶體消耗',
  defaultCharacterRender: '預設角色渲染',
  defaultCharacterRenderTip:
    '於髮型及臉型列表時，將預設把道具直接渲染成角色，可以有較佳的預覽體驗，但可能造成大量記憶體消耗',
  characterConcurrentRender: '角色快照同時渲染數量',
  characterConcurrentRenderTip:
    '提升或降低角色快照同時渲染數量，過多可能造成應用程式渲染緩慢',
  showItemGender: '顯示道具性別',
  showItemDyeable: '顯示染色標籤',
  onlyShowDyeable: '僅顯示可染色道具',
  tagVersion: '標籤版本',
  tagVersionTip:
    '變更名牌、勳章及稱號的顯示邏輯，在不同遊戲版本中使用的邏輯不同，可嘗試切換版本以獲得適當的顯示效果',
  syncSkinChange: '同步皮膚變更',

  otherTitle: '其他設定',
  watchTourAgain: '觀看基本教學',
  saveFolder: '存檔資料夾',
  openSaveFolder: '開啟存檔資料夾',
  cacheFolder: '暫存資料夾',
  openCacheFolder: '開啟暫存資料夾',
  clearCache: '清除暫存資料',
  clearCacheTip:
    '版本更新時若未顯示最新資料，可使用此功能清除暫存。此設定變更後須重整頁面',
  clearCacheConfirm: '確認是否清除暫存',
  clearCacheDesc:
    '若資料確定為舊版本資料時再使用此功能，點擊確認後將會清出暫存並重整頁面',
  preservePinStatus: '保留釘選狀態',
  preservePinStatusTip:
    '保留當前裝備及裝備選擇的釘選狀態，下次開啟時不需要重新釘選',

  currentVersion: '當前版本',
  newVersion: '最新版本',
  goToDownload: '點擊前往下載',
  discordLink: 'Discord 群組',
  goToDiscord: '點擊前往 Discord 群組邀請',
};
