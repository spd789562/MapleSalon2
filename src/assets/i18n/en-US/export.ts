import type { ExportDictionary } from '@/assets/i18n/type';

export const dict: ExportDictionary = {
  exportProgressFrame: 'Creating frame...',
  exportProgressReady: 'Ready to export...',

  text: 'Export',
  animation: 'Export Ani',
  frames: 'Export Frames',
  animationFrames: 'Export animation frames',
  parts: 'Export Layered',
  partsDesc:
    'Export Layered SpriteSheet, need PDN Plugin(ZIP Archive) to use it',
  assets: 'Export Assets',
  skillAssets: 'Export character and skill assets separately',
  zip: 'Export (.zip)',
  sheet: 'Export Sheet',
  format: 'Format',
  animateFormat: 'Format',
  forceExportEffect: 'Force Export Effect',
  forceExportEffectTip:
    'Animation and frames will have complete effects (like capes), but the animation will not loop seamlessly',
  animationWithEffect: 'Export Animation with Effects',
  currentFrames: 'Export Current Frames',
  snapshot: 'Export Snapshot',
  currentSnapshot: 'Export current snapshot',
  copySnapshot: 'Copy Snapshot',
  copyCurrentSnapshot: 'Copy current snapshot to clipboard',
  copied: 'Copied',
  copyToClipboard: 'Copy to clipboard',
  downloadAsImage: 'Download as image',
  copyImage: 'Copy image',

  exporting: 'Exporting...',
  effectExportDesc:
    'Export will take longer due to effects. Please do not leave this page as it may interrupt the export and cause the app to crash',

  notLoaded: 'Not loaded',
  actionNotLoaded: 'Actions are not fully loaded',
  success: 'Export successful',
  error: 'Unknown error occurred during export',
  copySuccess: 'Copy successful',
  copyError: 'Unknown error occurred while copying',
  errorFileTooBig:
    'Unknown error occurred during export, file may be too large',
  errorCanvas: 'Export failed, cannot create canvas',
  errorBlob: 'Export failed, cannot create blob',
};
