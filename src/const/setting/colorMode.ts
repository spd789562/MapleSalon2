export enum ColorMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

function isSystemDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function syncColorMode(colorMode: ColorMode) {
  const isDark =
    colorMode === ColorMode.Dark ||
    (colorMode === ColorMode.System && isSystemDarkMode());
  if (isDark) {
    document.documentElement.classList.add(ColorMode.Dark);
    document.documentElement.classList.remove(ColorMode.Light);
  } else {
    document.documentElement.classList.add(ColorMode.Light);
    document.documentElement.classList.remove(ColorMode.Dark);
  }
}

export function isValidColorMode(colorMode: string): colorMode is ColorMode {
  return Object.values(ColorMode).includes(colorMode as ColorMode);
}
