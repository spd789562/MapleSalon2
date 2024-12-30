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
  closeColor: 'Close color scene adjust',

  customTitle: 'Custom Background',
  xOffset: 'X Offset',
  yOffset: 'Y Offset',
  resetxOffset: 'Reset X',
  resetyOffset: 'Reset Y',
  repeatX: 'Repeat X',
  repeatY: 'Repeat Y',
  customUploadHistory: 'History',
  customSelectThis: 'Change to this',
  closeCustom: 'Close custom background adjust',
  uploadBackground: 'Upload Image',

  mapBackgroundTitle: 'Map Background',
  selectMap: 'Select Map',
  mapTargetPos: 'Target Position',
  mapTargetPosTip:
    'Drag withing range, or click the point and using arrow keys',
  mapTargetLayer: 'Target Layer',
  mapTargetLayerTip:
    'Change the target layer, prevent it been cover by other object',
  mapShowLayer: 'Layers',
  mapTag: 'Back/Foreground Tags',
  mapTagTip:
    'Toggle tag to control some obj or background only display on certain event or quest like tutorial arrow',
  mapTagBackground: 'Background',
  mapTagForeground: 'Foreground',
  mapTagParticle: 'Particle',
  mapTagEmpty: 'No Tag',
  mapObjTag: 'Object Tags',
  mapQuickSelect: 'History (max 5)',
  mapChangeMapTo: template<{ name: string }>('Click to change to {{name}}'),
  mapEmptySelection: 'No History',
  closeMap: 'Close map adjust',

  mapDialogTitle: 'Select Map',
  mapSearchPlaceholder: 'map name, region or id',
  mapUnselected: 'No Map Selected',
  minimapPreview: 'Minimap Preview',
  mapRegion: 'Region',
  mapName: 'Name',
  mapId: 'ID',
  minimapNotFound: 'Minimap not found',
  minimapTitle: template<{ name: string }>('{{name}} Minimap'),
};
