import { atom } from 'nanostores';

import { MainTourSteps, type UnTranslatedTourStepDetails } from '@/const/tour';
import { $toolTab } from './toolTab';
import { ToolTab } from '@/const/toolTab';

export const $currentTour = atom<UnTranslatedTourStepDetails[]>([]);

export const $mainTourOpen = atom<boolean>(false);

export function openMainTour() {
  if ($toolTab.get() !== ToolTab.Character) {
    $toolTab.set(ToolTab.Character);
  }

  $currentTour.set(MainTourSteps);
  $mainTourOpen.set(true);
}

export function closeMainTour() {
  $mainTourOpen.set(false);
  $currentTour.set([]);
}
