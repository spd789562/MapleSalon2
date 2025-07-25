import { createMemo, type Accessor } from 'solid-js';

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
>(options: T[] | Accessor<T[]>) {
  const locale = useLocale();
  const t = useTranslate();
  return createMemo(() => {
    const _ = locale();
    const _options = typeof options === 'function' ? options() : options;
    return _options.map((option) => ({
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
