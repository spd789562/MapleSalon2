import type { SceneDictionary } from '@/assets/i18n/type';
import { template } from '@solid-primitives/i18n';

export const dict: SceneDictionary = {
  toggleSceneSelection: 'Toggle Scene Selection',

  sceneAlpha: 'Alpha',
  sceneGrid: 'Gray Grid',
  sceneColor: 'Color',
  sceneHenesys: 'Henesys',
  sceneCustom: 'Custom',
  sceneMapleMap: 'Map',

  resetZoom: 'Reset Zoom',
  resetPosition: 'Reset Position',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom Out',

  colorPicker: 'Color Picker',
  defaultColor: 'Default Colors',
  closeColor: 'Close color background adjustment',

  customTitle: 'Custom Background',
  xOffset: 'X Offset',
  yOffset: 'Y Offset',
  resetxOffset: 'Reset X',
  resetyOffset: 'Reset Y',
  repeatX: 'Repeat X',
  repeatY: 'Repeat Y',
  customUploadHistory: 'Upload History',
  customSelectThis: 'Select This Background',
  closeCustom: 'Close custom background adjustment',
  uploadBackground: 'Upload Image',

  mapBackgroundTitle: 'Map Background',
  selectMap: 'Select Map',
  mapTargetPos: 'Object Position',
  mapTargetPosTip: 'Drag within range, or click the point and use arrow keys',
  mapTargetLayer: 'Object Layer',
  mapTargetLayerTip:
    'Change the object layer to prevent it from being covered by other map objects. Higher numbers are on top',
  mapShowLayer: 'Layers',
  mapTag: 'Back/Foreground Tags',
  mapTagTip:
    'Toggle tags to control objects or backgrounds that only display during certain events or quests (e.g., tutorial arrows)',
  mapTagBackground: 'Background',
  mapTagForeground: 'Foreground',
  mapTagParticle: 'Particle',
  mapTagEmpty: 'No Tag',
  mapObjTag: 'Object Tags',
  mapQuickSelect: 'Quick Select (max 5)',
  mapChangeMapTo: template<{ name: string }>('Click to change to {{name}}'),
  mapEmptySelection: 'No History',
  closeMap: 'Close map background adjustment',

  mapDialogTitle: 'Select Map',
  mapSearchPlaceholder: 'Map name, region, or ID',
  mapUnselected: 'No Map Selected',
  minimapPreview: 'Minimap Preview',
  mapRegion: 'Map Region',
  mapName: 'Map Name',
  mapId: 'Map ID',
  minimapNotFound: 'Minimap not found or cannot be loaded',
  minimapTitle: template<{ name: string }>('{{name}} Minimap'),
};
