import { Show, Match, Switch } from 'solid-js';
import { useTranslate } from '@/context/i18n';

import { useCharacterPreview } from './CharacterPreviewContext';

import { Text } from '@/components/ui/text';
import { ProgressWithBackdrop } from '@/components/elements/ProgressWithBackdrop';

export const ExportProgress = () => {
  const t = useTranslate();
  const [state] = useCharacterPreview();

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
            <Text size="xl">{t('export.exportProgressFrame')}</Text>
          </Match>
          <Match when={state.exportProgress === 100}>
            <Text size="xl">{t('export.exportProgressReady')}</Text>
          </Match>
        </Switch>
      </ProgressWithBackdrop>
    </Show>
  );
};
