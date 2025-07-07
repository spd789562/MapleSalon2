import type { TourDictionary } from '@/assets/i18n/type';

export const dict: TourDictionary = {
  next: 'Next',
  close: 'Close',
  skip: 'Skip',
  again: 'Restart',

  progress: '{{ current }} of {{ total }}',

  mainTourStartTitle: 'Basic Tutorial',
  mainTourStartDescription:
    'Welcome to MapleSalon2! It looks like this is your first time opening this software. Would you like to watch the basic tutorial?\nThis tutorial can be closed at any time and reopened in settings.',
  equipmentDrawerOpenTitle: 'Equipment Browser',
  equipmentDrawerOpenDescription:
    'Click here to open the equipment browser and adjustment panel.',

  equipmentDrawerCategorySelectionTitle: 'Equipment Category Selection',
  equipmentDrawerCategorySelectionDescription:
    'Click here to select equipment categories.',

  equipmentDrawerSaveTitle: 'Saved Equipment',
  equipmentDrawerSaveDescription:
    'When hovering over equipment, click the star in the top right corner to add to save and view in the saved tab.',

  currentEquipmentDrawerTitle: 'View Current Equipment',
  currentEquipmentDrawerDescription:
    'Click here to open the current equipment list, modify or delete equipment.',

  tabButtonCharacterPreviewTitle: 'Character Preview Tab',
  tabButtonCharacterPreviewDescription:
    'The default tab where you can adjust character appearance, actions, expressions, and more.',

  tabButtonCharacterAllActionsTitle: 'All Actions Tab',
  tabButtonCharacterAllActionsDescription:
    'This tab allows you to preview all actions of the current character and export materials at once.',

  characterPreviewSceneSelectionTitle: 'Scene Selection',
  characterPreviewSceneSelectionDescription:
    'Here you can select different backgrounds, upload custom images, or choose in-game maps.',

  characterPreviewExportButtonsTitle: 'Export Buttons',
  characterPreviewExportButtonsDescription:
    'Here you can export character animations, images, and copy snapshots to your clipboard for quick sharing!',

  characterPreviewSaveButtonsTitle: 'Save Buttons',
  characterPreviewSaveButtonsDescription:
    "Don't forget to save your changes before closing the window or switching characters.",

  characterSelectionDrawerOpenButtonTitle: 'Character Menu',
  characterSelectionDrawerOpenButtonDescription:
    'Click here to open or close the saved character menu.',

  characterSelectionAddDefaultCharacterTitle: 'Add Character',
  characterSelectionAddDefaultCharacterDescription:
    'Click here to add a default character.',

  characterSelectionDrawerCharacterMenuTitle: 'Character Operation Menu',
  characterSelectionDrawerCharacterMenuDescription:
    'Click the top right corner of saved characters to open the menu for copying or deleting specific characters.',

  finishTourTitle: 'Complete',
  finishTourDescription:
    'Congratulations on completing the basic tutorial! You can now start creating your characters freely!',
};
