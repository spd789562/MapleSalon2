import { atom } from 'nanostores';

export const $equpimentDrawerOpen = atom<boolean>(false);
export const $equpimentDrawerPin = atom<boolean>(false);
export const $equpimentDrawerEditType = atom<'mixDye' | 'hsvAdjust'>('mixDye');

export const $currentEquipmentDrawerOpen = atom<boolean>(false);
export const $currentEquipmentDrawerPin = atom<boolean>(false);

export const $characterSelectionDrawerOpen = atom<boolean>(false);

export const $sceneSelectionOpen = atom<boolean>(false);

export const $showPreviousCharacter = atom<boolean>(false);

export const $showUpscaledCharacter = atom<boolean>(false);

export const $confirmDialogOpen = atom<boolean>(false);

export const $settingDialogOpen = atom<boolean>(false);

export const $characterInfoDialogOpen = atom<boolean>(false);

export const $chairCharacterSelectionDialogOpen = atom<boolean>(false);

export const $mapSelectionDialogOpen = atom<boolean>(false);

/* a interaction lock use to prevent particular action */
export const $interactionLock = atom<boolean>(false);
