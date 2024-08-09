import { useStore } from '@nanostores/solid';

import { $isWzLoading } from '@/store/initialize';
import { removePathFromHistory } from '@/store/fileSelectHistory';

import CloseIcon from 'lucide-solid/icons/x';
import { IconButton } from '@/components/ui/icon-button';

export interface DeletePathButtonProps {
  path: string;
}
export const DeletePathButton = (props: DeletePathButtonProps) => {
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
      title="刪除此紀錄"
      variant="ghost"
      size="sm"
    >
      <CloseIcon />
    </IconButton>
  );
};
