import { createSignal, createMemo } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { usePureStore } from '@/store';
import { createEquipItemByCategory } from '@/store/character/selector';

import { HStack } from 'styled-system/jsx/hstack';
import { VStack } from 'styled-system/jsx/vstack';
import { Heading } from '@/components/ui/heading';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { AllColorTable } from './AllColorTable';
import { MixDyeTable } from './MixDyeTable';
import { ExportSeperateButton } from './ExportSeperateButton';

import { horizontalScroll } from '@/directive/horizontalScroll';

import { gatHairAvailableColorIds, getHairColorId } from '@/utils/mixDye';

import { HairColorHex } from '@/const/hair';

const $hairItem = createEquipItemByCategory('Hair');

export const HairDyeTab = () => {
  const allColorRefs: HTMLImageElement[] = [];
  const mixDyeColorRefs: HTMLImageElement[] = [];
  const [showFullCharacter, setShowFullCharacter] = createSignal(false);
  const hairItem = usePureStore($hairItem);

  const avaialbeHairColorIds = createMemo(() => {
    const hairId = hairItem()?.id;
    if (!hairId) {
      return [];
    }
    return gatHairAvailableColorIds(hairId);
  });

  function getHairColorHex(colorId: number) {
    return HairColorHex[getHairColorId(colorId)];
  }

  function handleSwitchChange({ checked }: ChangeDetails) {
    setShowFullCharacter(checked);
  }

  return (
    <VStack>
      <CardContainer>
        <HStack alignItems="flex-end" m="2">
          <Heading size="2xl">髮色預覽</Heading>
          <Switch
            checked={showFullCharacter()}
            onCheckedChange={handleSwitchChange}
          >
            顯示完整腳色
          </Switch>
          <HStack marginLeft="auto">
            <ExportSeperateButton
              fileName="hair-all-color.zip"
              images={allColorRefs}
              imageCounts={avaialbeHairColorIds().length}
            >
              匯出(.zip)
            </ExportSeperateButton>
          </HStack>
        </HStack>
        <TableContainer ref={horizontalScroll}>
          <AllColorTable
            category="Hair"
            avaialbeColorIds={avaialbeHairColorIds()}
            getColorHex={getHairColorHex}
            showFullCharacter={showFullCharacter()}
            refs={allColorRefs}
          />
        </TableContainer>
      </CardContainer>
      <CardContainer>
        <HStack alignItems="flex-end" m="2">
          <Heading size="2xl">混染預覽</Heading>
          <Switch
            checked={showFullCharacter()}
            onCheckedChange={handleSwitchChange}
          >
            顯示完整腳色
          </Switch>
          <HStack marginLeft="auto">
            <ExportSeperateButton
              fileName="hair-mix-dye.zip"
              images={mixDyeColorRefs}
              imageCounts={
                avaialbeHairColorIds().length * avaialbeHairColorIds().length
              }
            >
              匯出(.zip)
            </ExportSeperateButton>
          </HStack>
        </HStack>
        <TableContainer ref={horizontalScroll}>
          <MixDyeTable
            category="Hair"
            avaialbeColorIds={avaialbeHairColorIds()}
            getColorHex={getHairColorHex}
            getColorId={getHairColorId}
            showFullCharacter={showFullCharacter()}
            refs={mixDyeColorRefs}
          />
        </TableContainer>
      </CardContainer>
    </VStack>
  );
};

const CardContainer = styled('div', {
  base: {
    p: 2,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    maxWidth: '100%',
  },
});

const TableContainer = styled('div', {
  base: {
    overflowX: 'auto',
    maxWidth: '100%',
  },
});
