import { createSignal, createMemo, Show } from 'solid-js';

import { usePureStore } from '@/store';
import { createEquipItemByCategory } from '@/store/character/selector';

import { HStack } from 'styled-system/jsx/hstack';
import { VStack } from 'styled-system/jsx/vstack';
import { Heading } from '@/components/ui/heading';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { CardContainer, TableContainer, EmptyBlock } from './styledComponents';
import { AllColorTable } from './AllColorTable';
import { MixDyeTable } from './MixDyeTable';
import { ExportSeperateButton } from './ExportSeperateButton';
import { ExportTableButton } from './ExportTableButton';

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

  function bindScrollRef(ref: HTMLDivElement) {
    horizontalScroll(ref);
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
            <ExportTableButton
              fileName="hair-all-color.png"
              images={allColorRefs}
              avaialbeColorIds={avaialbeHairColorIds()}
              getColorHex={getHairColorHex}
              disabled={!hairItem()?.id}
            >
              匯出表格圖
            </ExportTableButton>
            <ExportSeperateButton
              fileName="hair-all-color.zip"
              images={allColorRefs}
              imageCounts={avaialbeHairColorIds().length}
              disabled={!hairItem()?.id}
            >
              匯出(.zip)
            </ExportSeperateButton>
          </HStack>
        </HStack>
        <TableContainer ref={bindScrollRef}>
          <Show
            when={hairItem()?.id}
            fallback={<EmptyBlock>尚未選擇髮型</EmptyBlock>}
          >
            <AllColorTable
              category="Hair"
              avaialbeColorIds={avaialbeHairColorIds()}
              getColorHex={getHairColorHex}
              showFullCharacter={showFullCharacter()}
              refs={allColorRefs}
            />
          </Show>
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
            <ExportTableButton
              fileName="hair-mix-dye.png"
              images={mixDyeColorRefs}
              avaialbeColorIds={avaialbeHairColorIds()}
              getColorHex={getHairColorHex}
              disabled={!hairItem()?.id}
            >
              匯出表格圖
            </ExportTableButton>
            <ExportSeperateButton
              fileName="hair-mix-dye.zip"
              images={mixDyeColorRefs}
              imageCounts={
                avaialbeHairColorIds().length * avaialbeHairColorIds().length
              }
              disabled={!hairItem()?.id}
            >
              匯出(.zip)
            </ExportSeperateButton>
          </HStack>
        </HStack>
        <TableContainer ref={bindScrollRef}>
          <Show
            when={hairItem()?.id}
            fallback={<EmptyBlock>尚未選擇髮型</EmptyBlock>}
          >
            <MixDyeTable
              category="Hair"
              avaialbeColorIds={avaialbeHairColorIds()}
              getColorHex={getHairColorHex}
              getColorId={getHairColorId}
              showFullCharacter={showFullCharacter()}
              refs={mixDyeColorRefs}
            />
          </Show>
        </TableContainer>
      </CardContainer>
    </VStack>
  );
};
