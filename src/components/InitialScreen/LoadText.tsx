import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate, type I18nKeys } from '@/context/i18n';

import { $initLoadProgress, InitLoadProgress } from '@/store/initialize';

import { Text } from '@/components/ui/text';

const TextMap = {
  [InitLoadProgress.SaveFile]: 'initial.loadPorgressSaveFile',
  [InitLoadProgress.InitWz]: 'initial.loadPorgressInitWz',
  [InitLoadProgress.InitString]: 'initial.loadPorgressInitString',
  [InitLoadProgress.InitItem]: 'initial.loadPorgressInitItem',
  [InitLoadProgress.Done]: 'initial.loadPorgressDone',
};

export const LoadText = () => {
  const t = useTranslate();
  const progress = useStore($initLoadProgress);

  return (
    <Show when={progress()}>
      {(p) => (
        <Text color="fg.subtle" size="sm">
          {t(TextMap[p()] as I18nKeys) as string}
        </Text>
      )}
    </Show>
  );
};
