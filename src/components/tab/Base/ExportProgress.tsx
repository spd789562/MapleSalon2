import { Show, Match, Switch } from 'solid-js';

import { Text } from '@/components/ui/text';
import { ProgressWithBackdrop } from '@/components/elements/ProgressWithBackdrop';

export interface BaseExportProgressProps {
  isExporting: boolean;
  exportProgress: number;
}
export const BaseExportProgress = (props: BaseExportProgressProps) => {
  return (
    <Show when={props.isExporting}>
      <ProgressWithBackdrop
        type="line"
        value={props.exportProgress}
        min={0}
        max={100}
        translations={{
          value({ value }) {
            return `${value}%`;
          },
        }}
      >
        <Switch>
          <Match when={props.exportProgress < 100}>
            <Text size="xl">正在建立影格</Text>
          </Match>
          <Match when={props.exportProgress === 100}>
            <Text size="xl">準備匯出中...</Text>
          </Match>
        </Switch>
      </ProgressWithBackdrop>
    </Show>
  );
};
