import type { InitialDictionary } from '@/assets/i18n/type';

export const dict: InitialDictionary = {
  selectWzTitle: 'Load New Base.wz',
  selectNewFile: 'New File',
  wzPositionTip:
    'Base.wz is typically located at {MapleStory folder path}/Data/Base/Base.wz. Note that this file is only the entry point for game data - you still need complete game files to use this application properly.',
  loadNewBaseWz: 'Load New Base.wz',

  loadProgressSaveFile: 'Initializing and loading save data...',
  loadProgressInitWz: 'Parsing wz file...',
  loadProgressInitString: 'Processing equipment data...',
  loadProgressInitItem: 'Processing chair data...',
  loadProgressDone: 'Almost done...',

  loadOption: 'Load Options',
  clearCache: 'Clear Cache',
  clearCacheTip:
    'Clear the cache before loading data to avoid issues when switching versions or upgrading the application',

  historyTitle: 'Load History',
  emptyHistoryText: 'No history available',
  historyPathTitle: 'Path',

  openPathTip: 'Open Path',
  fileOrPathNotExist: 'File or path does not exist',
  openPathError: 'Error occurred while opening path',

  loadExistBaseWz: 'Load',

  removeHistory: 'remove history',
};
