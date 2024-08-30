import { createEffect, For, untrack } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useStore } from '@nanostores/solid';

import {
  $selectedEquipSubCategory,
  $dyeResultCount,
  $dyeRenderId,
  $isRenderingDye,
  $onlyShowDyeable,
  $preserveOriginalDye,
  $dyeTypeEnabled,
  $dyeAction,
  $dyeResultColumnCount,
} from '@/store/toolTab';
import { getEquipById } from '@/store/string';
import {
  $isGlobalRendererInitialized,
  $globalRenderer,
} from '@/store/renderer';
import { $currentCharacterInfo } from '@/store/character/store';
import { $totalItems } from '@/store/character/selector';
import { deepCloneCharacterItems } from '@/store/character/utils';

import { Character } from '@/renderer/character/character';

import { Grid } from 'styled-system/jsx/grid';
import { DyeInfo } from './DyeInfo';
import { DyeCharacter } from './DyeCharacter';

import { extractCanvas, getBlobFromCanvas } from '@/utils/extract';
import { nextTick } from '@/utils/eventLoop';

import { DyeType } from '@/const/toolTab';
import { CharacterExpressions } from '@/const/emotions';
import { updateItemHsvInfo } from '@/store/character/action';

const DyePropertyMap = {
  [DyeType.Hue]: {
    min: 0,
    max: 360,
  },
  [DyeType.Saturation]: {
    min: -100,
    max: 100,
  },
  [DyeType.Birghtness]: {
    min: -100,
    max: 100,
  },
} as const;

function getActualNeedDyeCategories() {
  const selectedEquipSubCategory = $selectedEquipSubCategory.get();
  const totalItems = $totalItems.get();
  const isOnlyShowDyeable = $onlyShowDyeable.get();
  const actaulNeedDyeCategories = selectedEquipSubCategory.filter(
    (equipSubCategory) => {
      /* make sure the category is in current item */
      const item = totalItems[equipSubCategory as keyof typeof totalItems];
      if (!item) {
        return false;
      }
      if (isOnlyShowDyeable) {
        return getEquipById(item.id)?.isDyeable;
      }
      return true;
    },
  );
  return actaulNeedDyeCategories;
}

export interface DyeResultTableProps {
  refs?: HTMLImageElement[];
}
export function DyeResultTable(props: DyeResultTableProps) {
  const [state, setState] = createStore({
    results: [] as { url: string; info: Partial<Record<DyeType, number>> }[],
  });
  let testIndex = 0;
  const renderId = useStore($dyeRenderId);
  const isInit = useStore($isGlobalRendererInitialized);
  const gridColumns = useStore($dyeResultColumnCount);
  const character = new Character();

  function handleRef(i: number) {
    return (element: HTMLImageElement) => {
      if (!props.refs) {
        return;
      }
      props.refs[i] = element;
    };
  }

  function handleDyeClick(data: Partial<Record<DyeType, number>>) {
    const actualneedDyeCategories = getActualNeedDyeCategories();
    for (const equipSubCategory of actualneedDyeCategories) {
      for (const [dyeType, value] of Object.entries(data)) {
        updateItemHsvInfo(equipSubCategory, dyeType as DyeType, value);
      }
    }
  }

  function cleanUpStore() {
    const currentResults = untrack(() => state.results);
    for (const result of currentResults) {
      URL.revokeObjectURL(result.url);
    }
    testIndex = 0;
    setState('results', []);
  }

  createEffect(async () => {
    if (renderId() && isInit()) {
      $isRenderingDye.set(true);
      cleanUpStore();
      await nextTick();
      // return;

      const app = $globalRenderer.get();
      const currentCharacterInfo = $currentCharacterInfo.get();
      const characterData = {
        frame: 0,
        isAnimating: false,
        action: $dyeAction.get(),
        expression: CharacterExpressions.Default,
        earType: currentCharacterInfo.earType,
        handType: currentCharacterInfo.handType,
        items: deepCloneCharacterItems($totalItems.get()),
      };
      const actualneedDyeCategories = getActualNeedDyeCategories();
      const dyeResultCount = $dyeResultCount.get();
      const preserveOriginalDye = $preserveOriginalDye.get();
      const dyeTypeEnabled = $dyeTypeEnabled.get();
      if (
        !dyeTypeEnabled ||
        actualneedDyeCategories.length === 0 ||
        dyeResultCount < 1
      ) {
        $isRenderingDye.set(false);
        return;
      }
      /* reset dye when chose not preserve original dye */
      if (!preserveOriginalDye) {
        for (const equipSubCategory of actualneedDyeCategories) {
          if (characterData.items[equipSubCategory]) {
            characterData.items[equipSubCategory].hue = 0;
            characterData.items[equipSubCategory].saturation = 0;
            characterData.items[equipSubCategory].brightness = 0;
          }
        }
      }
      /* load once first */
      await character.update(characterData);

      /* start generate */
      const dyeRangeConfig = DyePropertyMap[dyeTypeEnabled];
      const step = (dyeRangeConfig.max - dyeRangeConfig.min) / dyeResultCount;
      for (let i = 0; i < dyeResultCount; i++) {
        const dyeNumber = Math.floor(dyeRangeConfig.min + step * i);
        for (const equipSubCategory of actualneedDyeCategories) {
          if (characterData.items[equipSubCategory]) {
            characterData.items[equipSubCategory][dyeTypeEnabled] = dyeNumber;
          }
        }
        await character.update(characterData);
        /* give some time */
        await nextTick();

        const canvas = extractCanvas(character, app.renderer);
        const blob = await getBlobFromCanvas(canvas as HTMLCanvasElement);
        if (blob) {
          const url = URL.createObjectURL(blob);
          setState('results', testIndex, {
            url,
            info: { [dyeTypeEnabled]: dyeNumber },
          });
          testIndex++;
        }
      }
      $isRenderingDye.set(false);
    }
  });
  return (
    <Grid
      gap={0}
      justifyContent="center"
      style={{
        'grid-template-columns': `repeat(${gridColumns()}, auto)`,
      }}
    >
      <For each={state.results}>
        {(result, i) => (
          <DyeCharacter
            url={result.url}
            dyeData={result.info}
            handleDyeClick={handleDyeClick}
            ref={handleRef(i())}
            dyeInfo={<DyeInfo dyeData={result.info} />}
          />
        )}
      </For>
    </Grid>
  );
}
