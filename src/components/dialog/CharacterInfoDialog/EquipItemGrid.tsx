import { Show, createSignal, createMemo } from 'solid-js';

import { usePureStore } from '@/store';
import { $currentCharacterInfo } from '@/store/characterInfo';
import { getEquipById } from '@/store/string';

import { useExportContent } from './CharacterInfoDialog';

import CopyIcon from 'lucide-solid/icons/copy';
import ArrowDownToLineIcon from 'lucide-solid/icons/arrow-down-to-line';
import { Grid } from 'styled-system/jsx/grid';
import { Stack } from 'styled-system/jsx/stack';
import { Heading } from '@/components/ui/heading';
import { IconButton } from '@/components/ui/icon-button';
import { EquipItem } from './EquipItem';

import { downloadBlob } from '@/utils/download';
import { copyImage } from '@/utils/clipboard';
import { nextTick } from '@/utils/eventLoop';
import { toaster } from '@/components/GlobalToast';

/**
 * Grid layout
 * |  (Weapon|CashWeapon) | Shield   |
 * |  Cap                 | EyeAcc   |
 * |  (Overall|Coat)      | FaceAcc  |
 * |  Pants               | Earrings |
 * |  Cape                | Glove    |
 * |  Shoes               | NameTag  |
 */
export const EquipItemGrid = () => {
  const [isExporting, setIsExporting] = createSignal(false);
  const exportContent = useExportContent();
  const currentCharacterInfo = usePureStore($currentCharacterInfo);

  const nameTagItem = createMemo(() => {
    const id = currentCharacterInfo()?.nameTagId;
    if (!id) {
      return undefined;
    }
    return getEquipById(id);
  });

  async function handleCopyToClipboard() {
    if (!exportContent) {
      return;
    }
    setIsExporting(true);
    await nextTick();
    try {
      const blob = await exportContent();
      const url = URL.createObjectURL(blob);
      await copyImage(url);
      URL.revokeObjectURL(url);
      toaster.success({
        title: '已複製',
      });
    } catch (_) {
      toaster.error({
        title: '匯出失敗',
      });
    }
    setIsExporting(false);
  }

  async function handleDownload() {
    if (!exportContent) {
      return;
    }
    setIsExporting(true);
    await nextTick();
    try {
      const blob = await exportContent();
      downloadBlob(blob, 'character-info.png');
    } catch (_) {
      toaster.error({
        title: '匯出失敗',
      });
    }
    setIsExporting(false);
  }

  return (
    <Show when={currentCharacterInfo()?.items}>
      {(items) => (
        <Grid columns={2}>
          <Show when={!items().CashWeapon}>
            <EquipItem category="Weapon" item={items().Weapon} />
          </Show>
          <Show when={!items().Weapon && items().CashWeapon}>
            <EquipItem category="CashWeapon" item={items().CashWeapon} />
          </Show>
          <EquipItem category="Shield" item={items().Shield} />
          <EquipItem category="Cap" item={items().Cap} />
          <EquipItem
            category="Eye Decoration"
            item={items()['Eye Decoration']}
          />
          <Show when={!items().Overall}>
            <EquipItem category="Coat" item={items().Coat} />
          </Show>
          <Show when={!items().Coat && items().Overall}>
            <EquipItem category="Overall" item={items().Overall} />
          </Show>
          <EquipItem
            category="Face Accessory"
            item={items()['Face Accessory']}
          />
          <EquipItem category="Pants" item={items().Pants} />
          <EquipItem category="Earrings" item={items().Earrings} />
          <EquipItem category="Cape" item={items().Cape} />
          <EquipItem category="Glove" item={items().Glove} />
          <EquipItem category="Shoes" item={items().Shoes} />
          <EquipItem category="NameTag" item={nameTagItem()} />
          <Stack direction="row" alignItems="flex-end" justify="flex-end" gridColumn="2/2">
            <Show when={!isExporting()}>
              <IconButton
                onClick={handleCopyToClipboard}
                variant="outline"
                title="複製至剪貼簿"
              >
                <CopyIcon />
              </IconButton>
              <IconButton onClick={handleDownload} title="下載成圖片">
                <ArrowDownToLineIcon />
              </IconButton>
            </Show>
          </Stack>
        </Grid>
      )}
    </Show>
  );
};

export const EquipSalonItemGrid = () => {
  const currentCharacterInfo = usePureStore($currentCharacterInfo);

  return (
    <Show when={currentCharacterInfo()?.items}>
      {(items) => (
        <Stack marginTop="auto" w="full">
          <Heading size="lg">美容資訊</Heading>
          <EquipItem category="Skin" item={items().Head} />
          <EquipItem category="Hair" item={items().Hair} />
          <EquipItem category="Face" item={items().Face} />
        </Stack>
      )}
    </Show>
  );
};
