import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';
import { styled } from 'styled-system/jsx/factory';

import {
  $selectedEquipSubCategory,
  $dyeResultCount,
  $dyeRenderId,
  $dyeTypeEnabled,
  $isRenderingDye,
} from '@/store/toolTab';

import LoaderCircle from 'lucide-solid/icons/loader-circle';
import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';

export const StartDyeButton = () => {
  const t = useTranslate();
  const isLoading = useStore($isRenderingDye);

  function handleClick() {
    if ($isRenderingDye.get()) {
      return;
    }
    if ($selectedEquipSubCategory.get().length === 0) {
      toaster.error({
        title: t('dye.emptyEquipSelection'),
      });
      return;
    }
    if (!$dyeTypeEnabled.get()) {
      toaster.error({
        title: t('dye.emptyTypeSelection'),
      });
    }
    if ($dyeResultCount.get() < 32) {
      toaster.error({
        title: t('dye.emptyDyeCount'),
      });
      return;
    }
    $dyeRenderId.set(Date.now().toString());
    $isRenderingDye.set(true);
  }

  return (
    <Button onClick={handleClick} disabled={isLoading()}>
      <Show when={isLoading()}>
        <Loading>
          <LoaderCircle />
        </Loading>
      </Show>
      {t('dye.generateDyeTable')}
    </Button>
  );
};

const Loading = styled('div', {
  base: {
    animation: 'rotate infinite 1s linear',
    color: 'fg.muted',
  },
});
