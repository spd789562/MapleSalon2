import type { GrayColor } from '@park-ui/panda-preset';
import { syncGrayColor, syncAccentColor } from '@/utils/theme';
import { css } from 'styled-system/css';

export enum Theme {
  Tomato = 'tomato',
  Crimson = 'crimson',
  Orange = 'orange',
  Amber = 'amber',
  Grass = 'grass',
  Cyan = 'cyan',
  Sky = 'sky',
  Iris = 'iris',
  Plum = 'plum',
}

export enum Gray {
  Neutral = 'neutral',
  Mauve = 'mauve',
  Olive = 'olive',
  Sand = 'sand',
  Slate = 'slate',
}

export const GrayMapping: Record<Theme, Gray> = {
  [Theme.Tomato]: Gray.Mauve,
  [Theme.Crimson]: Gray.Mauve,
  [Theme.Orange]: Gray.Sand,
  [Theme.Amber]: Gray.Sand,
  [Theme.Grass]: Gray.Olive,
  [Theme.Cyan]: Gray.Slate,
  [Theme.Sky]: Gray.Slate,
  [Theme.Iris]: Gray.Neutral,
  [Theme.Plum]: Gray.Slate,
};

export const ThemeColor: Record<Theme, string> = {
  [Theme.Tomato]: `${Theme.Tomato}.9`,
  [Theme.Crimson]: `${Theme.Crimson}.9`,
  [Theme.Orange]: `${Theme.Orange}.9`,
  [Theme.Amber]: `${Theme.Amber}.9`,
  [Theme.Grass]: `${Theme.Grass}.9`,
  [Theme.Cyan]: `${Theme.Cyan}.9`,
  [Theme.Sky]: `${Theme.Sky}.9`,
  [Theme.Iris]: `${Theme.Iris}.9`,
  [Theme.Plum]: `${Theme.Plum}.9`,
};

export function syncTheme(theme: Theme) {
  syncAccentColor(theme, { document });
  syncGrayColor(GrayMapping[theme] as GrayColor, { document });
}

export function isValidTheme(theme: string): theme is Theme {
  return Object.values(Theme).includes(theme as Theme);
}

/* for panda css */
const _ = [
  css.raw({ bgColor: ThemeColor.tomato }),
  css.raw({ bgColor: ThemeColor.crimson }),
  css.raw({ bgColor: ThemeColor.orange }),
  css.raw({ bgColor: ThemeColor.amber }),
  css.raw({ bgColor: ThemeColor.grass }),
  css.raw({ bgColor: ThemeColor.cyan }),
  css.raw({ bgColor: ThemeColor.sky }),
  css.raw({ bgColor: ThemeColor.iris }),
  css.raw({ bgColor: ThemeColor.plum }),
];
