import { Show, type JSX } from 'solid-js';

import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $equipmentDrawerExperimentCharacterRender,
  $isShowExperimentCharacterRenderSwitch,
} from '@/store/equipDrawer';

import { Flex } from 'styled-system/jsx/flex';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { IconCssTooltip, IconType } from '@/components/elements/IconTooltip';

export const BaseCharacterRenderingSwitch = () => {
  const t = useTranslate();

  const checked = useStore($equipmentDrawerExperimentCharacterRender);

  function handleChange(detail: ChangeDetails) {
    $equipmentDrawerExperimentCharacterRender.set(detail.checked);
  }

  return (
    <Flex flexDirection="row" gap={2} textAlign="left">
      <Flex alignItems="center" gap={1}>
        <Text as="label" size="sm">
          {t('setting.characterRender')}
        </Text>
        <IconCssTooltip
          tooltip={t('setting.characterRenderTip')}
          type={IconType.Info}
        />
      </Flex>
      <Switch
        id="CharacterRenderingSwitch"
        checked={checked()}
        onCheckedChange={handleChange}
        width="2.4rem"
      />
    </Flex>
  );
};

export const ShowOnHairOrFace = (props: { children: JSX.Element }) => {
  const isShow = useStore($isShowExperimentCharacterRenderSwitch);
  return <Show when={isShow()}>{props.children}</Show>;
};

export const CharacterRenderingSwitch = () => {
  return (
    <ShowOnHairOrFace>
      <BaseCharacterRenderingSwitch />
    </ShowOnHairOrFace>
  );
};
