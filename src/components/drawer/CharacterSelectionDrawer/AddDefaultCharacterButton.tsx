import { styled } from 'styled-system/jsx/factory';
import { useTranslate } from '@/context/i18n';

import PlusIcon from 'lucide-solid/icons/plus';
import { Button } from '@/components/ui/button';

import { appendDefaultCharacter } from '@/store/characterDrawer';

import CharacterUnknownPng from '@/assets/character-unknown.png';

export const AddDefaultCharacterButton = () => {
  const t = useTranslate();

  const handleClick = () => {
    appendDefaultCharacter();
  };

  return (
    <Button
      id="button-add-default-character"
      onClick={handleClick}
      title={t('setting.newCharacter')}
      variant="outline"
      position="relative"
      height="unset"
      width="4.5rem"
    >
      <CharacterImage
        alt={t('setting.newCharacter')}
        src={CharacterUnknownPng}
      />
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
