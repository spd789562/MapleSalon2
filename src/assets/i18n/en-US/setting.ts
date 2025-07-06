import type { SettingDictionary } from '@/assets/i18n/type';

export const dict: SettingDictionary = {
  save: 'Save',
  saveSuccess: 'Saved successfully',
  saveAsNew: 'Save as new character',
  saveCharacterSuccess: 'Character saved',
  saveAsNewCharacterSuccess: 'Saved as new character',
  cancel: 'Cancel',
  cancelChanges: 'Cancel changes',
  cancelChangesDesc:
    'This operation cannot be undone. Are you sure you want to cancel the changes?',
  cancelCharacterChanges: 'Cancel any unsaved character changes',
  abandonCharacterChanges: 'Yes',
  abandonCharacterChangesDesc:
    'Current changes have not been saved. Do you want to discard the changes?',
  abandonCharacterChangesTitle: 'Confirm discard unsaved changes',
  upload: 'Upload',
  uploadFailed: 'Upload failed',
  uploadCharacter: 'Upload character',
  fileFormatError: 'File format error',
  newCharacter: 'New character',
  openCrrentEquipment: 'Current Equipment',
  applyUpscale: 'Apply Upscale',
  showCompare: 'Compare',
  refreshPage: 'Refresh Page',
  refreshNow: 'Refresh Now',
  refreshLater: 'Refresh Later',

  open: 'Open Settings',
  title: 'Settings',

  language: 'Language',
  selectLanguage: 'Select Language',

  windowTitle: 'Window Setting',
  freeResize: 'Free Resize Window',
  resolution: 'Resolution',
  scale: 'Scale',
  scaleConfirm: 'Change Scale',
  scaleConfirmDesc:
    'This setting may cause display issues if too large. Are you sure you want to change the scale to {{resolution}}?',
  apply: 'Apply',

  themeTitle: 'Theme Settings',
  theme: 'Theme',
  color: 'Color Mode',
  colorLight: 'Light',
  colorDark: 'Dark',
  colorSystem: 'System',

  exportTitle: 'Export Setting',
  frameRemainSpace: 'Padding Space',
  frameRemainSpaceTip:
    'Frames will be unified to the same size for better playback. If unchecked, the exported zip will contain JSON files for each frame positioning',
  gifWithBackground: 'GIF Background',
  gitWithBackgroundTip:
    'This setting will add background color to exported GIFs, improving issues with black and white artifacts when exporting semi-transparent equipment',

  renderTitle: 'Render Settings',
  renderer: 'Renderer',
  rendererTip:
    'Default is WebGPU. In some cases, it may fail to render sometime. Page refresh required after changing this setting',
  changeRendererConfirm: 'Change Renderer',
  changeRendererConfirmDesc:
    'Page needs to be reloaded to apply new renderer settings. Do you want to refresh the page now?',
  scaleMode: 'Scale Mode',
  scaleModeTip:
    'Default is linear. Changing to nearest will preserve pixel effects when zooming. Page refresh required after changing this setting',
  scaleModeLinear: 'Linear',
  scaleModeNearest: 'Nearest',
  scaleModeConfirm: 'Change Scale Mode',
  scaleModeConfirmDesc:
    'Page needs to be reloaded to apply new scale settings. Do you want to refresh the page now?',
  experimentalUpscale: 'Experimental Upscale',
  experimentalUpscaleTip:
    'Add button to show upscaled character preview using Anime4K. This feature may impact performance - please ensure you have sufficient computer resources',
  characterRender: 'Character',
  characterRenderTip:
    'Render hair and face directly into character for better preview experience, but may use significant RAM',
  defaultCharacterRender: 'Default Character Render',
  defaultCharacterRenderTip:
    'When browsing hair/face, render them directly into character for better preview experience, but may use significant RAM',
  characterConcurrentRender: 'Character Concurrent Count',
  characterConcurrentRenderTip:
    'Increase or decrease the number of characters rendered simultaneously. Too many may cause slow application rendering',
  showItemGender: 'Show Gender',
  showItemDyeable: 'Show Dyeable',
  onlyShowDyeable: 'Only Show Dyeable',
  tagVersion: 'Tag Version',
  tagVersionTip:
    'Change the display logic for name tags, medals, and titles. Different game versions use different logic - try switching versions for appropriate display',
  syncSkinChange: 'Sync Skin',

  otherTitle: 'Other Setting',
  watchTourAgain: 'Watch Tutorial',
  saveFolder: 'Save Folder',
  openSaveFolder: 'Open save folder',
  cacheFolder: 'Cache Folder',
  openCacheFolder: 'Open cache folder',
  clearCache: 'Clear Cache',
  clearCacheTip:
    "Use this function to clear cache when version updates don't show latest data. Page refresh required after changing this setting",
  clearCacheConfirm: 'Do you want to clear the cache?',
  clearCacheDesc:
    'Use this function only when data is confirmed to be outdated or missing. Clicking confirm will clear cache and refresh the page',
  preservePinStatus: 'Preserve Pin Status',
  preservePinStatusTip:
    "Preserve current equipment and equipment selection pin status so you don't need to re-pin next time",

  currentVersion: 'Current Version',
  newVersion: 'New Version',
  goToDownload: 'Go to download',
  discordLink: 'Discord',
  goToDiscord: 'Click to Discord invite',
};
