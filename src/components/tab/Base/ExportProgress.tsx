import { Show, Match, Switch } from 'solid-js';
import { useTranslate } from '@/context/i18n';

import { Text } from '@/components/ui/text';
import { ProgressWithBackdrop } from '@/components/elements/ProgressWithBackdrop';

export interface BaseExportProgressProps {
  isExporting: boolean;
  exportProgress: number;
}
export const BaseExportProgress = (props: BaseExportProgressProps) => {
  const t = useTranslate();
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
            <Text size="xl">{t('export.exportProgressFrame')}</Text>
          </Match>
          <Match when={props.exportProgress === 100}>
            <Text size="xl">{t('export.exportProgressReady')}</Text>
          </Match>
        </Switch>
      </ProgressWithBackdrop>
    </Show>
  );
};
