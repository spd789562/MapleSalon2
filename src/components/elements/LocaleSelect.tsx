import { useSetLocale, useTranslate } from '@/context/i18n';

import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';
import { saveSetting, setLang } from '@/store/settingDialog';

import { LOCALES, LOCALE_NAMES, type Locale } from '@/assets/i18n/type';

export const LocaleSelect = () => {
  const t = useTranslate();
  const [locale, setLocale] = useSetLocale();

  function handleChange(details: ValueChangeDetails) {
    const locale = details.value?.[0] as Locale;
    setLang(locale);
    setLocale(details.value?.[0] as Locale);
    saveSetting();
  }

  return (
    <SimpleSelect
      positioning={{
        sameWidth: true,
      }}
      value={[locale()]}
      items={LOCALES.map((locale) => ({
        label: LOCALE_NAMES[locale],
        value: locale,
      }))}
      title={t('setting.selectLanguage')}
      onValueChange={handleChange}
    />
  );
};
