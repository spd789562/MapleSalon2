import type { SystemStyleObject } from 'styled-system/types';
import { css } from 'styled-system/css';

export enum PreviewScene {
  Alpha = 'alpha',
  Color = 'color',
  Henesys = 'henesys',
}

export const PreviewSceneNames: Record<PreviewScene, string> = {
  [PreviewScene.Alpha]: '透明背景',
  [PreviewScene.Color]: '純色背景',
  [PreviewScene.Henesys]: '弓箭手村背景',
};

export const PreviewSceneBackground: Record<PreviewScene, SystemStyleObject> = {
  [PreviewScene.Alpha]: {
    backgroundImage:
      'conic-gradient(white 90deg, #999 90deg, #999 180deg, white 180deg, white 270deg, #999 270deg, #999 360deg, white 360deg)',
    backgroundSize: '16px 16px',
    backgroundRepeat: 'repeat',
  },
  [PreviewScene.Color]: {},
  [PreviewScene.Henesys]: {
    backgroundImage: 'henesysBackground',
  },
};
/* for panda css generate css token */
const _ = [
  css.raw(PreviewSceneBackground.alpha),
  css.raw(PreviewSceneBackground.henesys),
];

export const PreviewSceneThemeMap: Record<PreviewScene, string> = {
  [PreviewScene.Alpha]: 'light',
  [PreviewScene.Color]: 'light',
  [PreviewScene.Henesys]: 'light',
};
