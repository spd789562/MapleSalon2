import { atom } from 'nanostores';

import { type ToolTab, ActionExportType } from '@/const/toolTab';

export const $toolTab = atom<ToolTab | undefined>(undefined);

export const $actionExportType = atom<ActionExportType>(ActionExportType.Gif);
