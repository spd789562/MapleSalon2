import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $initLoadProgress, InitLoadProgress } from '@/store/initialize';

import { Text } from '@/components/ui/text';

const TextMap = {
  [InitLoadProgress.SaveFile]: '初始化並載入存檔...',
  [InitLoadProgress.InitWz]: '解析 wz 檔案...',
  [InitLoadProgress.InitString]: '預處理裝備資料...',
  [InitLoadProgress.InitItem]: '預處理椅子資料...',
  [InitLoadProgress.Done]: '即將完成',
};

export const LoadText = () => {
  const progress = useStore($initLoadProgress);

  return (
    <Show when={progress()}>
      {(p) => (
        <Text color="fg.subtle" size="sm">
          {TextMap[p()]}
        </Text>
      )}
    </Show>
  );
};
