import { Show, Match, Switch } from 'solid-js';

import { useMountTab } from './MountTabContext';

import { Text } from '@/components/ui/text';
import { ProgressWithBackdrop } from '@/components/elements/ProgressWithBackdrop';

export const ExportProgress = () => {
  const [state] = useMountTab();

  return (
    <Show when={state.isExporting}>
      <ProgressWithBackdrop
        type="line"
        value={state.exportProgress}
        min={0}
        max={100}
        translations={{
          value({ value }) {
            return `${value}%`;
          },
        }}
      >
        <Switch>
          <Match when={state.exportProgress < 100}>
            <Text size="xl">正在建立影格</Text>
          </Match>
          <Match when={state.exportProgress === 100}>
            <Text size="xl">準備匯出中...</Text>
          </Match>
        </Switch>
      </ProgressWithBackdrop>
    </Show>
  );
};
