import { atom } from 'nanostores';

export interface ItemContextMenuTargetInfo {
  id: number;
  name: string;
  icon: string;
}
export const $itemContextMenuTargetInfo = atom<
  ItemContextMenuTargetInfo | undefined
>();

export function setItemContextMenuTargetInfo(info: ItemContextMenuTargetInfo) {
  $itemContextMenuTargetInfo.set(info);
}
export function clearItemContextMenuTargetInfo() {
  $itemContextMenuTargetInfo.set(undefined);
}
