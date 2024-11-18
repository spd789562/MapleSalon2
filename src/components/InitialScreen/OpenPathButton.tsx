import { useStore } from '@nanostores/solid';
import { exists } from '@tauri-apps/plugin-fs';
import { normalize } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-shell';

import { $isWzLoading } from '@/store/initialize';

import FolderIcon from 'lucide-solid/icons/folder-symlink';
import { IconButton } from '@/components/ui/icon-button';

import { toaster } from '@/components/GlobalToast';

const FilePathReg = /\/[^/]+$/;

export interface OpenPathButtonProps {
  path: string;
}
export const OpenPathButton = (props: OpenPathButtonProps) => {
  const isGlobalWzLoading = useStore($isWzLoading);

  async function handleClick() {
    if (isGlobalWzLoading()) {
      return;
    }
    const path = props.path;
    try {
      const isExist = await exists(path);
      if (!isExist) {
        throw new Error('檔案或路徑已不存在');
      }
    } catch (_) {
      toaster.error({
        title: '檔案或路徑已不存在',
      });
    }
    /* D:/what/ever/Data/Base/Base.wz to D:/what/ever/Data/Base */
    const folder = path.replace(/\\/g, '/').replace(FilePathReg, '');
    try {
      await open(folder);
    } catch (_) {
      toaster.error({
        title: '開啟路徑時發生錯誤',
      });
    }
  }

  return (
    <IconButton
      onClick={handleClick}
      disabled={isGlobalWzLoading()}
      title="開啟此路徑"
      variant="outline"
      size="sm"
    >
      <FolderIcon />
    </IconButton>
  );
};
