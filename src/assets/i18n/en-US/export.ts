import type { ExportDictionary } from '@/assets/i18n/type';

export const dict: ExportDictionary = {
  exportProgressFrame: 'Creating frame...',
  exportProgressReady: 'Ready to export...',

  text: 'Export',
  animation: 'Export Ani',
  frames: 'Export Frames',
  animationFrames: 'Export animation frames',
  assets: 'Export Assets',
  skillAssets: 'Export character and skill assets seperately',
  zip: 'Export (.zip)',
  sheet: 'Export Sheet',
  format: 'Format',
  animatFormat: 'Format',
  forceExportEffect: 'Force Export Effect',
  forceExportEffectTip:
    'The animation and frames will have all effects frame (like some cape), but the animation will not loop seamlessly',
  animationWithEffect: 'Export Animation including effects',
  currentFrames: 'Export Current Frames',
  snapshot: 'Export Snapshot',
  currentSnapshot: 'Export current snapshot',
  copySnapshot: 'Copy Snapshot',
  copyCurrentSnapshot: 'Copy current snapshot to clipboard',
  copied: 'Copied',
  copyToClipboard: 'Copy to clipboard',
  downloadAsImage: 'Download image',
  copyImage: 'Copy image',

  exporting: 'Exporting...',
  effectExportDesc:
    'The export will take longer time due to the effect, please do not leave this page, it will cause the export to be interrupted and app might be crash',

  notLoaded: 'Not loaded',
  actionNotLoaded: 'The actions are not loaded',
  success: 'Export success',
  error: 'Something want wrong when exporting',
  copySuccess: 'Copy success',
  copyError: 'Something want wrong when copying',
  errorFileTooBig:
    'Something want wrong when exporting, the file might too big',
  errorCanvas: "Export failed, can't not create canvas",
  errorBlob: "Export failed, can't not create Blob",
};
