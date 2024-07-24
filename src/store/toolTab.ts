import { atom } from 'nanostores';

import { ToolTab } from '@/const/toolTab';

export const $toolTab = atom<ToolTab>(ToolTab.AllAction);
