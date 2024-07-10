import { Button } from '@/components/ui/button';

import { appendDefaultCharacter } from '@/store/characterDrawer';

export const AddDefaultCharacterButton = () => {
  const handleClick = () => {
    appendDefaultCharacter();
  };

  return <Button onClick={handleClick}>Add Character</Button>;
};
