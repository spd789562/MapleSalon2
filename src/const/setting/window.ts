export type Resolution =
  | '1024x768'
  | '1280x720'
  | '1366x768'
  | '1440x900'
  | '1600x900';
export interface ResolutionOption {
  name: Resolution;
  width: number;
  height: number;
}
export const DefaultResolution: Resolution = '1024x768';
export const WindowResolutions: ResolutionOption[] = [
  {
    name: '1024x768',
    width: 1024,
    height: 768,
  },
  {
    name: '1280x720',
    width: 1280,
    height: 720,
  },
  {
    name: '1366x768',
    width: 1366,
    height: 768,
  },
  {
    name: '1440x900',
    width: 1440,
    height: 900,
  },
  {
    name: '1600x900',
    width: 1600,
    height: 900,
  },
];

export function getResolutionOption(name: Resolution) {
  return WindowResolutions.find((option) => option.name === name);
}

export function isValidResolution(name: Resolution) {
  return !!getResolutionOption(name);
}
