import {
  createSignal,
  createContext,
  createResource,
  useContext,
  type JSX,
  type Accessor,
} from 'solid-js';
import {
  flatten,
  translator,
  resolveTemplate,
  type Translator,
} from '@solid-primitives/i18n';
import { dict as zhTwDict } from '@/assets/i18n/zh-TW';
import type {
  RawDictionary,
  Dictionary,
  Locale,
  I18nKeys,
} from '@/assets/i18n/type';
import { DEFAULT_LOCALE, LOCALES } from '@/assets/i18n/type';

export type AppTranslator = Translator<Dictionary>;

export interface UseI18nContextReturn {
  locale: Accessor<Locale>;
  setLocale: (locale: Locale) => void;
  t: AppTranslator;
  tArg: AppTranslator;
}

export const I18nContext = createContext<UseI18nContextReturn>();

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = (await import(`@/assets/i18n/${locale}/index.ts`))
    .dict;
  return flatten(dict);
}

export function I18nProvider(props: {
  children: JSX.Element;
}) {
  const [locale, setLocale] = createSignal<Locale>(
    (window.__LANG__ as Locale) || DEFAULT_LOCALE,
  );
  const [dict] = createResource(locale, fetchDictionary, {
    initialValue: flatten(zhTwDict),
  });

  const t = translator(dict);
  const tArg = translator(dict, resolveTemplate);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        tArg,
      }}
    >
      {props.children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within a I18nProvider');
  }

  return context;
}

export function useTranslate() {
  const { tArg } = useI18n();
  return tArg;
}

export function useTranslateArg() {
  const { tArg } = useI18n();
  return tArg;
}

export function useLocale() {
  const { locale } = useI18n();
  return locale;
}

export function useSetLocale() {
  const { locale, setLocale } = useI18n();
  return [locale, setLocale] as const;
}

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

export type { I18nKeys };
