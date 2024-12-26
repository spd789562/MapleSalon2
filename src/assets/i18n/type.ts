import type { Flatten } from '@solid-primitives/i18n';
import type { dict } from './zh_tw';

export type RawDictionary = typeof dict;
export type InitialDictionary = RawDictionary['initial'];
export type ErrorDictionary = RawDictionary['error'];

export type Dictionary = Flatten<RawDictionary>;
export type I18nKeys = keyof Dictionary;

export type Locale = 'zh_tw';
