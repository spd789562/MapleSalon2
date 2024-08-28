import type { JSX } from 'solid-js';
import { appCacheDir, appDataDir } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-shell';

import FolderIcon from 'lucide-solid/icons/folder-symlink';
import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';

export enum PathType {
  Data = 'data',
  Cache = 'cache',
}
export interface OpenFolderButtonProps {
  type: PathType;
  title: string;
  children: JSX.Element;
}
export const OpenFolderButton = (props: OpenFolderButtonProps) => {
  async function handleClick() {
    const folder = await (props.type === PathType.Data
      ? appDataDir()
      : appCacheDir());
    try {
      await open(folder);
    } catch (_) {
      toaster.error({
        title: '開啟路徑時發生錯誤',
      });
    }
  }

  return (
    <Button onClick={handleClick} title={props.title} variant="outline">
      {props.children}
      <FolderIcon />
    </Button>
  );
};
