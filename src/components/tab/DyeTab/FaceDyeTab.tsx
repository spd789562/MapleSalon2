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

import { gatFaceAvailableColorIds, getFaceColorId } from '@/utils/mixDye';

import { FaceColorHex } from '@/const/face';

const $faceItem = createEquipItemByCategory('Face');

export const FaceDyeTab = () => {
  const allColorRefs: HTMLImageElement[] = [];
  const mixDyeColorRefs: HTMLImageElement[] = [];
  const [showFullCharacter, setShowFullCharacter] = createSignal(false);
  const faceItem = usePureStore($faceItem);

  const avaialbeFaceColorIds = createMemo(() => {
    const faceId = faceItem()?.id;
    if (!faceId) {
      return [];
    }
    return gatFaceAvailableColorIds(faceId);
  });

  function getFaceColorHex(colorId: number) {
    return FaceColorHex[getFaceColorId(colorId)];
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
          <Heading size="2xl">顏色預覽</Heading>
          <Switch
            checked={showFullCharacter()}
            onCheckedChange={handleSwitchChange}
          >
            顯示完整腳色
          </Switch>
          <HStack marginLeft="auto">
            <ExportTableButton
              fileName="face-all-color.png"
              images={allColorRefs}
              avaialbeColorIds={avaialbeFaceColorIds()}
              getColorHex={getFaceColorHex}
              disabled={!faceItem()?.id}
            >
              匯出表格圖
            </ExportTableButton>
            <ExportSeperateButton
              fileName="face-all-color.zip"
              images={allColorRefs}
              imageCounts={avaialbeFaceColorIds().length}
              disabled={!faceItem()?.id}
            >
              匯出(.zip)
            </ExportSeperateButton>
          </HStack>
        </HStack>
        <TableContainer ref={bindScrollRef}>
          <Show
            when={faceItem()?.id}
            fallback={<EmptyBlock>尚未選擇臉型</EmptyBlock>}
          >
            <AllColorTable
              category="Face"
              avaialbeColorIds={avaialbeFaceColorIds()}
              getColorHex={getFaceColorHex}
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
              fileName="face-mix-dye.png"
              images={mixDyeColorRefs}
              avaialbeColorIds={avaialbeFaceColorIds()}
              getColorHex={getFaceColorHex}
              disabled={!faceItem()?.id}
            >
              匯出表格圖
            </ExportTableButton>
            <ExportSeperateButton
              fileName="face-mix-dye.zip"
              images={mixDyeColorRefs}
              imageCounts={
                avaialbeFaceColorIds().length * avaialbeFaceColorIds().length
              }
              disabled={!faceItem()?.id}
            >
              匯出(.zip)
            </ExportSeperateButton>
          </HStack>
        </HStack>
        <TableContainer ref={bindScrollRef}>
          <Show
            when={faceItem()?.id}
            fallback={<EmptyBlock>尚未選擇臉型</EmptyBlock>}
          >
            <MixDyeTable
              category="Face"
              avaialbeColorIds={avaialbeFaceColorIds()}
              getColorHex={getFaceColorHex}
              getColorId={getFaceColorId}
              showFullCharacter={showFullCharacter()}
              refs={mixDyeColorRefs}
            />
          </Show>
        </TableContainer>
      </CardContainer>
    </VStack>
  );
};
