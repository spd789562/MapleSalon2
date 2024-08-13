import { atom } from 'nanostores';

export const $equpimentDrawerOpen = atom<boolean>(false);
export const $equpimentDrawerPin = atom<boolean>(false);

export const $currentEquipmentDrawerOpen = atom<boolean>(false);
export const $currentEquipmentDrawerPin = atom<boolean>(false);

export const $characterSelectionDrawerOpen = atom<boolean>(false);

export const $sceneSelectionOpen = atom<boolean>(false);

export const $showPreviousCharacter = atom<boolean>(false);

export const $confirmDialogOpen = atom<boolean>(false);

export const $settingDialogOpen = atom<boolean>(false);