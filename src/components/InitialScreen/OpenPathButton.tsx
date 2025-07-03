import { useStore } from '@nanostores/solid';
import { exists } from '@tauri-apps/plugin-fs';
import { openPath } from '@tauri-apps/plugin-opener';

import { useTranslate } from '@/context/i18n';

import { $isWzLoading } from '@/store/initialize';

import FolderIcon from 'lucide-solid/icons/folder-symlink';
import { IconButton } from '@/components/ui/icon-button';

import { toaster } from '@/components/GlobalToast';

const FilePathReg = /\/[^/]+$/;

export interface OpenPathButtonProps {
  path: string;
}
export const OpenPathButton = (props: OpenPathButtonProps) => {
  const t = useTranslate();
  const isGlobalWzLoading = useStore($isWzLoading);

  async function handleClick() {
    if (isGlobalWzLoading()) {
      return;
    }
    const path = props.path;
    try {
      const isExist = await exists(path);
      if (!isExist) {
        throw new Error('path not exist');
      }
    } catch (_) {
      toaster.error({
        title: t('initial.fileOrPathNotExist'),
      });
      return;
    }
    /* D:/what/ever/Data/Base/Base.wz to D:/what/ever/Data/Base */
    const folder = path.replace(/\\/g, '/').replace(FilePathReg, '');
    try {
      await openPath(folder);
    } catch (_) {
      toaster.error({
        title: t('initial.openPathError'),
      });
    }
  }

  return (
    <IconButton
      onClick={handleClick}
      disabled={isGlobalWzLoading()}
      title={t('initial.openPathTip')}
      variant="outline"
      size="sm"
    >
      <FolderIcon />
    </IconButton>
  );
};
