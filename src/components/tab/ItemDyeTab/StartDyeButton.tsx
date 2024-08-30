import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
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
  const isLoading = useStore($isRenderingDye);

  function handleClick() {
    if ($isRenderingDye.get()) {
      return;
    }
    if ($selectedEquipSubCategory.get().length === 0) {
      toaster.error({
        title: '請選擇想要預覽染色的裝備',
      });
      return;
    }
    if (!$dyeTypeEnabled.get()) {
      toaster.error({
        title: '請選擇想要預覽的染色類型',
      });
    }
    if ($dyeResultCount.get() < 32) {
      toaster.error({
        title: '請輸入染色數量',
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
      產生染色表
    </Button>
  );
};

const Loading = styled('div', {
  base: {
    animation: 'rotate infinite 1s linear',
    color: 'fg.muted',
  },
});
