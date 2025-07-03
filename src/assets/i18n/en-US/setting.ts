import type { SettingDictionary } from '@/assets/i18n/type';

export const dict: SettingDictionary = {
  save: 'Save',
  saveSuccess: 'Saved',
  saveAsNew: 'Save as new character',
  saveCharacterSuccess: 'Saved',
  saveAsNewCharacterSuccess: 'Saved as new character',
  cancel: 'Cancel',
  cancelChanges: 'Cancel changes',
  cancelChangesDesc:
    'This operation cannot be undone, are you sure you want to cancel the changes?',
  cancelCharacterChanges: 'Cancel any character changes',
  abandonCharacterChanges: 'Yes',
  abandonCharacterChangesDesc:
    'The current character changes have not been save, are your sure want change chaaracter anyway?',
  abandonCharacterChangesTitle: 'Character changes not saved',
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

  open: 'Open Setting',
  title: 'Setting',

  language: 'Language',
  selectLanguage: 'Select Language',

  windowTitle: 'Window Setting',
  freeResize: 'Free Resize Window',
  resolution: 'Resolution',
  scale: 'Scale',
  scaleConfirm: 'Change Scale',
  scaleConfirmDesc:
    'This setting may cause the application display normally, are you sure you want to change the scale to {{resolution}}?',
  apply: 'Apply',

  themeTitle: 'Theme Setting',
  theme: 'Theme',
  color: 'Color Mode',
  colorLight: 'Light',
  colorDark: 'Dark',
  colorSystem: 'System',

  exportTitle: 'Export Setting',
  frameRemainSpace: 'Padding Space',
  frameRemainSpaceTip:
    'The frame will be unified to the same size, if uncheck this, the exported zip will contain json files for each frame',
  gifWithBackground: 'Gif Background',
  gitWithBackgroundTip:
    'This setting will make the exported Gif have background color, improving the problem of black and white when exporting some equipment as semi-transparent',

  renderTitle: 'Render Setting',
  renderer: 'Renderer',
  rendererTip:
    'The default is WebGPU, in some cases it may fail to render. This setting needs to be refreshed after changing',
  changeRendererConfirm: 'Change Renderer',
  changeRendererConfirmDesc:
    'The page needs to be reloaded to apply the new renderer settings, do you want to reload the page now?',
  scaleMode: 'Scale Mode',
  scaleModeTip:
    'The default is linear, changing to nearest will retain the pixel effect when zooming. This setting needs to be refreshed after changing',
  scaleModeLinear: 'Linear',
  scaleModeNearest: 'Nearest',
  scaleModeConfirm: 'Change Scale Mode',
  scaleModeConfirmDesc:
    'The page needs to be reloaded to apply the new scale settings, do you want to reload the page now?',
  experimentalUpscale: 'Experimental Upscale',
  experimentalUpscaleTip:
    'Add new switch to apply anime4k on character preview, please make sure you have enough computer resources to use this feature',
  characterRender: 'Character',
  characterRenderTip:
    'Render hair and face directly into character, can have better experience, but may use a lot of RAM',
  defaultCharacterRender: 'Default Character Render',
  defaultCharacterRenderTip:
    'When browsing hair/face, render them directly into character, can have better experience, but may use a lot of RAM',
  characterConcurrentRender: 'Character Concurrent Count',
  characterConcurrentRenderTip:
    'Increase or decrease the number of character rendered at the same time, too many may cause the application to render slowly',
  showItemGender: 'Show Gender',
  showItemDyeable: 'Show Dyeable',
  onlyShowDyeable: 'Only Show Dyeable',
  tagVersion: 'Tag Version',
  tagVersionTip:
    'The position of the name tag, medal and title display is different in verious game versions, try to switching versions to get the appropriate display',
  syncSkinChange: 'Sync Skin',

  otherTitle: 'Other Setting',
  watchTourAgain: 'Watch Tour',
  saveFolder: 'Save Folder',
  openSaveFolder: 'Open save folder',
  cacheFolder: 'Cache Folder',
  openCacheFolder: 'Open cache folder',
  clearCache: 'Clear Cache',
  clearCacheTip:
    'When changing the game version and data have not been updated, you can use this function to clear the cache. This setting needs to be refreshed after changing',
  clearCacheConfirm: 'Do you want to clear the cache?',
  clearCacheDesc:
    'If you surly seeing the old data or data missing, click confirm to clear the cache and refresh the page',
  preservePinStatus: 'Preserve Pin Status',
  preservePinStatusTip:
    'Preserve the current equipment and equipment selection pin status so no need to re-pin next time',

  currentVersion: 'Current Version',
  newVersion: 'New Version',
  goToDownload: 'Go to download',
  discordLink: 'Discord',
  goToDiscord: 'Click to Discord invite',
};
