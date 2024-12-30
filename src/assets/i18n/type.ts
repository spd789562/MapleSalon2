import type { Flatten } from '@solid-primitives/i18n';
import type { dict } from './zh-TW';

export type RawDictionary = typeof dict;
export type InitialDictionary = RawDictionary['initial'];
export type CharacterDictionary = RawDictionary['character'];
export type ExportDictionary = RawDictionary['export'];
export type SettingDictionary = RawDictionary['setting'];
export type SceneDictionary = RawDictionary['scene'];
export type DyeDictionary = RawDictionary['dye'];
export type TabDictionary = RawDictionary['tab'];
export type CommonDictionary = RawDictionary['common'];
export type ErrorDictionary = RawDictionary['error'];

export type Dictionary = Flatten<RawDictionary>;
export type I18nKeys = keyof Dictionary;

export type Locale = 'zh-TW' | 'en-US';
export const DEFAULT_LOCALE: Locale = 'en-US';
export const LOCALES: Locale[] = ['zh-TW', 'en-US'];
export const LOCALE_NAMES: Record<Locale, string> = {
  'zh-TW': '繁體中文',
  'en-US': 'English',
};
