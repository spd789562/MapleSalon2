import { useStore } from '@nanostores/solid';

import {
  $isExportable,
  $dyeResultCount,
  $dyeResultColumnCount,
} from '@/store/toolTab';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { ResultColumnCountNumberInput } from './ResultColumnCountNumberInput';
import { DyeResultTable } from './DyeResultTable';
import { ExportTableButton } from './ExportTableButton';
import { ExportSeperateButton } from '../DyeTab/ExportSeperateButton';

export const DyeResult = () => {
  const isExportable = useStore($isExportable);
  const count = useStore($dyeResultCount);
  const columnCounts = useStore($dyeResultColumnCount);
  const dyeCharacterRefs: HTMLImageElement[] = [];

  return (
    <>
      <HStack>
        <Heading size="lg" width="rem">
          染色結果
        </Heading>
        <HStack>
          <Text>每行數量</Text>
          <ResultColumnCountNumberInput />
        </HStack>
        <HStack ml="auto">
          <ExportTableButton
            fileName="dye-table.png"
            images={dyeCharacterRefs}
            imageCounts={count()}
            columnCounts={columnCounts()}
            disabled={!isExportable()}
          >
            匯出表格圖
          </ExportTableButton>
          <ExportSeperateButton
            fileName="dye-table.zip"
            images={dyeCharacterRefs}
            imageCounts={count()}
            disabled={!isExportable()}
          >
            匯出(.zip)
          </ExportSeperateButton>
        </HStack>
      </HStack>
      <DyeResultTable refs={dyeCharacterRefs} />
    </>
  );
};
