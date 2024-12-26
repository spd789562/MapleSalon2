import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $isWzLoading } from '@/store/initialize';
import { removePathFromHistory } from '@/store/fileSelectHistory';

import CloseIcon from 'lucide-solid/icons/x';
import { IconButton } from '@/components/ui/icon-button';

export interface DeletePathButtonProps {
  path: string;
}
export const DeletePathButton = (props: DeletePathButtonProps) => {
  const t = useTranslate();
  const isGlobalWzLoading = useStore($isWzLoading);

  async function handleClick() {
    if (isGlobalWzLoading()) {
      return;
    }
    await removePathFromHistory(props.path);
  }

  return (
    <IconButton
      onClick={handleClick}
      disabled={isGlobalWzLoading()}
      title={t('initial.removeHistory')}
      variant="ghost"
      size="sm"
    >
      <CloseIcon />
    </IconButton>
  );
};
