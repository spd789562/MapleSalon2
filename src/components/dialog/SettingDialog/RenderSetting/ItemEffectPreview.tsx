import { useStore } from '@nanostores/solid';

import { $showItemDyeable } from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { LoadableEquipIcon } from '@/components/LoadableEquipIcon';

const DEMO_ITEM_MALE_ID = 1040005;
const DEMO_ITEM_MALE_NAME = '橙色棒球服';

const DEMO_ITEM_FEMALE_ID = 1041009;
const DEMO_ITEM_FEMALE_NAME = '紅女學生服';

const DEMO_ITEM_SHARE_ID = 1042006;
const DEMO_ITEM_SHARE_NAME = '綠色冒險服';

export const ItemEffectPreview = () => {
  const isDyeable = useStore($showItemDyeable);

  return (
    <HStack gap="2">
      <LoadableEquipIcon
        id={DEMO_ITEM_SHARE_ID}
        name={DEMO_ITEM_SHARE_NAME}
        isDyeable={isDyeable()}
      />
      <LoadableEquipIcon
        id={DEMO_ITEM_MALE_ID}
        name={DEMO_ITEM_MALE_NAME}
        isDyeable={isDyeable()}
      />
      <LoadableEquipIcon
        id={DEMO_ITEM_FEMALE_ID}
        name={DEMO_ITEM_FEMALE_NAME}
        isDyeable={isDyeable()}
      />
    </HStack>
  );
};
