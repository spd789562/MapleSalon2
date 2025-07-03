import {
  $equpimentDrawerOpen,
  $equpimentDrawerPin,
  $characterSelectionDrawerOpen,
} from '@/store/trigger';
import { $equipmentDrawerEquipCategorySelectionOpen } from '@/store/equipDrawer';

import type { TourStepDetails, TourStepAction } from '@/components/ui/tour';

import type { I18nKeys } from '@/context/i18n';
import { ToolTab } from '@/const/toolTab';

export type UnTranslatedTourStepDetails = Omit<
  TourStepDetails,
  'title' | 'description' | 'actions'
> & {
  title: I18nKeys;
  description: I18nKeys;
  actions?: UnTranslatedTourStepAction[];
};
export type UnTranslatedTourStepAction = Omit<TourStepAction, 'label'> & {
  label: I18nKeys;
};

export const MainTourSteps: UnTranslatedTourStepDetails[] = [
  {
    id: 'main-tour-start',
    title: 'tour.mainTourStartTitle',
    description: 'tour.mainTourStartDescription',
    actions: [
      { label: 'tour.next', action: 'next' },
      { label: 'tour.close', action: 'dismiss' },
    ],
  },
  {
    id: 'equipment-drawer-open',
    title: 'tour.equipmentDrawerOpenTitle',
    description: 'tour.equipmentDrawerOpenDescription',
    type: 'tooltip',
    placement: 'top',
    target: () => document.getElementById('button-equipment-drawer-toggle'),
    actions: [{ label: 'tour.next', action: 'next' }],
    effect: ({ show, goto }) => {
      if ($equpimentDrawerOpen.get()) {
        goto('equipment-drawer-category-selection');
      } else {
        show();
      }
      return () => {};
    },
  },
  {
    id: 'equipment-drawer-category-selection',
    title: 'tour.equipmentDrawerCategorySelectionTitle',
    description: 'tour.equipmentDrawerCategorySelectionDescription',
    type: 'tooltip',
    placement: 'top',
    target: () =>
      document.getElementById('button-equipment-category-selection'),
    actions: [{ label: 'tour.next', action: 'next' }],
    effect: ({ show }) => {
      if ($equipmentDrawerEquipCategorySelectionOpen.get()) {
        $equipmentDrawerEquipCategorySelectionOpen.set(false);
      }
      if (!$equpimentDrawerOpen.get()) {
        $equpimentDrawerOpen.set(true);
      }
      setTimeout(() => {
        show();
      }, 500);
      return () => {};
    },
  },
  {
    id: 'equipment-drawer-save',
    title: 'tour.equipmentDrawerSaveTitle',
    description: 'tour.equipmentDrawerSaveDescription',
    type: 'tooltip',
    placement: 'top',
    target: () => document.querySelector('#equipment-list button'),
    actions: [{ label: 'tour.next', action: 'next' }],
  },
  {
    id: 'current-equipment-drawer-step-0',
    title: 'tour.currentEquipmentDrawerTitle',
    description: 'tour.currentEquipmentDrawerDescription',
    type: 'tooltip',
    placement: 'top',
    target: () =>
      document.getElementById('button-current-equipment-drawer-toggle'),
    actions: [{ label: 'tour.next', action: 'next' }],
    effect: ({ show }) => {
      setTimeout(() => {
        if (!$equpimentDrawerPin.get()) {
          $equpimentDrawerOpen.set(false);
        }
      }, 500);
      show();
      return () => {};
    },
  },
  {
    id: 'tab-button-character-preview',
    title: 'tour.tabButtonCharacterPreviewTitle',
    description: 'tour.tabButtonCharacterPreviewDescription',
    type: 'tooltip',
    placement: 'bottom',
    target: () => document.getElementById(`tab-button-${ToolTab.Character}`),
    actions: [{ label: 'tour.next', action: 'next' }],
  },
  {
    id: 'tab-button-character-all-actions',
    title: 'tour.tabButtonCharacterAllActionsTitle',
    description: 'tour.tabButtonCharacterAllActionsDescription',
    type: 'tooltip',
    placement: 'bottom',
    target: () => document.getElementById(`tab-button-${ToolTab.AllAction}`),
    actions: [{ label: 'tour.next', action: 'next' }],
  },
  {
    id: 'character-preview-scene-selection',
    title: 'tour.characterPreviewSceneSelectionTitle',
    description: 'tour.characterPreviewSceneSelectionDescription',
    type: 'tooltip',
    placement: 'top',
    target: () => document.getElementById('character-preview-scene-selection'),
    actions: [{ label: 'tour.next', action: 'next' }],
  },
  {
    id: 'character-preview-export-buttons',
    title: 'tour.characterPreviewExportButtonsTitle',
    description: 'tour.characterPreviewExportButtonsDescription',
    type: 'tooltip',
    placement: 'top',
    target: () => document.getElementById('character-preview-export-buttons'),
    actions: [{ label: 'tour.next', action: 'next' }],
  },
  {
    id: 'character-preview-save-buttons',
    title: 'tour.characterPreviewSaveButtonsTitle',
    description: 'tour.characterPreviewSaveButtonsDescription',
    type: 'tooltip',
    placement: 'top',
    target: () => document.getElementById('character-preview-save-buttons'),
    actions: [{ label: 'tour.next', action: 'next' }],
  },
  {
    id: 'character-selection-drawer-open-button',
    title: 'tour.characterSelectionDrawerOpenButtonTitle',
    description: 'tour.characterSelectionDrawerOpenButtonDescription',
    type: 'tooltip',
    placement: 'bottom',
    target: () =>
      document.getElementById('button-character-selection-drawer-toggle'),
    actions: [{ label: 'tour.next', action: 'next' }],
  },
  {
    id: 'character-selection-add-default-character',
    title: 'tour.characterSelectionAddDefaultCharacterTitle',
    description: 'tour.characterSelectionAddDefaultCharacterDescription',
    type: 'tooltip',
    placement: 'bottom',
    target: () => document.getElementById('button-add-default-character'),
    actions: [{ label: 'tour.next', action: 'next' }],
    effect: ({ show }) => {
      if (!$characterSelectionDrawerOpen.get()) {
        $characterSelectionDrawerOpen.set(true);
        setTimeout(() => {
          show();
        }, 500);
      } else {
        show();
      }
      return () => {};
    },
  },
  {
    id: 'character-selection-drawer-character-menu',
    title: 'tour.characterSelectionDrawerCharacterMenuTitle',
    description: 'tour.characterSelectionDrawerCharacterMenuDescription',
    type: 'tooltip',
    placement: 'bottom',
    target: () =>
      document.querySelector('#character-selection-drawer-content .iconButton'),
    actions: [{ label: 'tour.next', action: 'next' }],
    effect: ({ show, next }) => {
      const target = document.querySelector(
        '#character-selection-drawer-content .menu__trigger',
      );
      if (!target) {
        next();
      } else {
        show();
      }
      return () => {};
    },
  },
  {
    id: 'finish-tour',
    title: 'tour.finishTourTitle',
    description: 'tour.finishTourDescription',
    actions: [
      {
        label: 'tour.again',
        attrs: {
          variant: 'outline',
        },
        action: ({ goto }) => {
          goto(1 as unknown as string);
        },
      },
      { label: 'tour.close', action: 'dismiss' },
    ],
  },
];
