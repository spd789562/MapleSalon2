import { atom } from 'nanostores';

import { $confirmDialogOpen } from './trigger';
export { $confirmDialogOpen };

import type { ButtonProps } from '@/components/ui/button';

export enum DialogType {
  Confirm = 'confirm',
  Alert = 'alert',
}

export interface ButtonConfig {
  isDisabled?: boolean;
  isAsyncClick?: boolean;
  onClick?: (() => void) | (() => Promise<void>);
  variant?: ButtonProps['variant'];
  text?: string;
}

export interface CommonDialogData {
  title: string;
  description?: string;
  closable?: boolean;
}

export interface ConfirmDialogData extends CommonDialogData {
  type: DialogType.Confirm;
  confirmButton?: ButtonConfig;
  cancelButton?: ButtonConfig;
}
export interface AlertDialogData extends CommonDialogData {
  type: DialogType.Alert;
  confirmButton?: ButtonConfig;
}

export type DialogData = ConfirmDialogData | AlertDialogData;

export const $confirmDialogData = atom<DialogData | null>(null);


export function openDialog(data: DialogData) {
  $confirmDialogData.set(data);
  $confirmDialogOpen.set(true);
}

export function resetDialogData() {
  $confirmDialogData.set(null);
}
