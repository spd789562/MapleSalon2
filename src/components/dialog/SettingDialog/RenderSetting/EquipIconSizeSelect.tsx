import { useStore } from '@nanostores/solid';
import { useTranslate, type I18nKeys } from '@/context/i18n';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import {
  $equipmentDrawerCharacterSize,
  $equipmentDrawerIconSize,
} from '@/store/equipDrawer';
import {
  setEquipDrawerCharacterSize,
  setEquipDrawerIconSize,
} from '@/store/settingDialog';
import {
  EquipDrawerItemSize,
  isValidEquipDrawerItemSize,
} from '@/const/equipDrawer';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';
import type { WritableAtom } from 'nanostores';

const SIZE_OPTIONS: { label: I18nKeys; value: EquipDrawerItemSize }[] = [
  {
    label: 'setting.equipDrawerItemSizeSmall',
    value: EquipDrawerItemSize.Small,
  },
  {
    label: 'setting.equipDrawerItemSizeMedium',
    value: EquipDrawerItemSize.Medium,
  },
  {
    label: 'setting.equipDrawerItemSizeBig',
    value: EquipDrawerItemSize.Big,
  },
];

const EXTRA_SIZE_OPTIONS: { label: I18nKeys; value: EquipDrawerItemSize }[] = [
  {
    label: 'setting.equipDrawerItemSizeExtraBig',
    value: EquipDrawerItemSize.ExtraBig,
  },
];

interface EquipDrawerItemSizeSelectProps {
  id: string;
  labelKey: 'setting.equipIconSize' | 'setting.equipCharacterSize';
  store: WritableAtom<EquipDrawerItemSize>;
  onChange: (value: EquipDrawerItemSize) => void;
  options: { label: I18nKeys; value: EquipDrawerItemSize }[];
}

const EquipDrawerItemSizeSelect = (props: EquipDrawerItemSizeSelectProps) => {
  const t = useTranslate();
  const size = useStore(props.store);
  const options = useLocalizedOptions(props.options);

  function handleChange(details: ValueChangeDetails) {
    const next = details.value?.[0];
    if (isValidEquipDrawerItemSize(next)) {
      props.onChange(next);
    }
  }

  return (
    <HStack>
      <Text as="label" for={props.id} textWrap="nowrap">
        {t(props.labelKey)}
      </Text>
      <SimpleSelect
        id={props.id}
        positioning={{
          sameWidth: true,
        }}
        items={options()}
        value={[size()]}
        onValueChange={handleChange}
        width="6rem"
      />
    </HStack>
  );
};

export const EquipIconSizeSelect = () => (
  <EquipDrawerItemSizeSelect
    id="equip-icon-size-select"
    labelKey="setting.equipIconSize"
    store={$equipmentDrawerIconSize}
    onChange={setEquipDrawerIconSize}
    options={[...SIZE_OPTIONS, ...EXTRA_SIZE_OPTIONS]}
  />
);

export const EquipCharacterSizeSelect = () => (
  <EquipDrawerItemSizeSelect
    id="equip-character-size-select"
    labelKey="setting.equipCharacterSize"
    store={$equipmentDrawerCharacterSize}
    onChange={setEquipDrawerCharacterSize}
    options={SIZE_OPTIONS}
  />
);
