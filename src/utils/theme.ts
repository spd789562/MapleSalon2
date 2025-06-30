import type { AccentColor, GrayColor } from '@park-ui/panda-preset';
import { token, type Token } from 'styled-system/tokens';

type Context = {
  document?: Document;
};

const syncColorPalette = (
  color: GrayColor | AccentColor,
  name: 'accent' | 'gray',
  doc: Document,
) => {
  const root = doc.querySelector<HTMLHtmlElement>(':root');
  if (!root) {
    return;
  }

  const hues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
  const isDefaultColor = color === 'neutral';

  isDefaultColor
    ? hues.map((hue) => {
        root.style.removeProperty(`--colors-${name}-${hue}`);
        root.style.removeProperty(`--colors-${name}-a${hue}`);
      })
    : hues.map((hue) => {
        root.style.setProperty(
          `--colors-${name}-${hue}`,
          token.var(`colors.${color}.${hue}` as Token),
        );
        root.style.setProperty(
          `--colors-${name}-a${hue}`,
          token.var(`colors.${color}.a${hue}` as Token),
        );
      });
};

export const syncGrayColor = (color: GrayColor, context?: Context) => {
  const doc = context?.document ?? document;
  syncColorPalette(color, 'gray', doc);
};

export const syncAccentColor = (color: AccentColor, context?: Context) => {
  const doc = context?.document ?? document;
  const root = doc.querySelector<HTMLHtmlElement>(':root');
  if (!root) return;

  syncColorPalette(color, 'accent', doc);

  if (color === 'neutral') {
    root.style.removeProperty('--colors-accent-fg');
    root.style.removeProperty('--colors-accent-default');
    root.style.removeProperty('--colors-accent-emphasized');
    root.style.removeProperty('--colors-accent-text');

    return;
  }

  /* thouse text might bkacl */
  if (['amber', 'lime', 'mint', 'sky', 'yellow'].includes(color)) {
    root.style.setProperty(
      '--colors-accent-fg',
      token.var('colors.gray.light.12'),
    );
    root.style.setProperty(
      '--colors-accent-default',
      token.var('colors.accent.9'),
    );
    root.style.setProperty(
      '--colors-accent-emphasized',
      token.var('colors.accent.10'),
    );
    root.style.setProperty(
      '--colors-accent-text',
      token.var('colors.accent.a11'),
    );
    return;
  }

  root.style.setProperty('--colors-accent-fg', token.var('colors.white'));
  root.style.setProperty(
    '--colors-accent-default',
    token.var('colors.accent.9'),
  );
  root.style.setProperty(
    '--colors-accent-emphasized',
    token.var('colors.accent.10'),
  );
  root.style.setProperty(
    '--colors-accent-text',
    token.var('colors.accent.a11'),
  );
};
