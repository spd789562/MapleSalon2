import { createMemo } from 'solid-js';

import { useTranslate, useLocale, type I18nKeys } from '@/context/i18n';

export function useLocalizedOptions<
  T extends {
    label: I18nKeys | string;
    value:
      | {
          toString: () => string;
        }
      | string;
  },
>(options: T[]) {
  const locale = useLocale();
  const t = useTranslate();
  return createMemo(() => {
    const _ = locale();
    return options.map((option) => ({
      label: option.label.includes('.')
        ? (t(option.label as I18nKeys) as string)
        : (option.label as string),
      value:
        typeof option.value === 'string'
          ? option.value
          : option.value.toString(),
    }));
  });
}
