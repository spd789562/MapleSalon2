import { $settingDialogOpen } from '@/store/trigger';

import BookOpenTextIcon from 'lucide-solid/icons/book-open-text';
import { Button } from '@/components/ui/button';

export interface ReWatchTourButtonProps {
  openTour: () => void;
  title: string;
}
export const ReWatchTourButton = (props: ReWatchTourButtonProps) => {
  function handleClick() {
    $settingDialogOpen.set(false);
    props.openTour();
  }

  return (
    <Button onClick={handleClick} title={props.title} variant="outline">
      {props.title}
      <BookOpenTextIcon />
    </Button>
  );
};
