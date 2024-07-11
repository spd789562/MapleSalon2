import { styled } from 'styled-system/jsx/factory';

import PlusIcon from 'lucide-solid/icons/plus';
import { Button } from '@/components/ui/button';

import { appendDefaultCharacter } from '@/store/characterDrawer';

import CharacterUnknownPng from '@/assets/character-unknown.png';

export const AddDefaultCharacterButton = () => {
  const handleClick = () => {
    appendDefaultCharacter();
  };

  return (
    <Button
      onClick={handleClick}
      title="新增角色"
      variant="outline"
      position="relative"
      height="unset"
      width="4.5rem"
    >
      <CharacterImage alt="新增角色-圖片" src={CharacterUnknownPng} />
      <PlusIcon size={28} style={{ width: 'unset', height: 'unset' }} />
    </Button>
  );
};

const CharacterImage = styled('img', {
  base: {
    position: 'absolute',
    maxWidth: '5rem',
    opacity: 0.3,
    _dark: {
      filter: 'invert(1)',
    },
  },
});
