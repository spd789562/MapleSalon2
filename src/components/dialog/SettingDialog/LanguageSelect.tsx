import { styled } from 'styled-system/jsx/factory';

import { useTranslate } from '@/context/i18n';

import TranslateIcon from 'mingcute_icon/svg/editor/translate_2_line.svg';

import { HStack } from 'styled-system/jsx/hstack';
import { LocaleSelect } from '@/components/elements/LocaleSelect';

export const LanguageSelect = () => {
  const t = useTranslate();
  return (
    <LanguageSelectContainer>
      <div title={t('setting.language')}>
        <TranslateIcon width="32" height="32" />
      </div>
      <LocaleSelect />
    </LanguageSelectContainer>
  );
};

const LanguageSelectContainer = styled(HStack, {
  base: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    marginX: 'auto',
    width: '14rem',
    alignItems: 'center',
    borderBottomRadius: 'md',
    p: 2,
    bg: 'bg.default',
    boxShadow: 'sm',
  },
});
