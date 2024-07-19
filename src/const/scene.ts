import type { SystemStyleObject } from 'styled-system/types';
import { css } from 'styled-system/css';

import HenesysBackgroundImage from '@/assets/background/henesysType2.png';

export enum PreviewScene {
  Alpha = 'alpha',
  Black = 'black',
  White = 'white',
  Henesys = 'henesys',
}

export const PreviewSceneNames: Record<PreviewScene, string> = {
  [PreviewScene.Alpha]: '透明背景',
  [PreviewScene.Black]: '黑色背景',
  [PreviewScene.White]: '白色背景',
  [PreviewScene.Henesys]: '弓箭手村背景',
};

export const PreviewSceneBackground: Record<PreviewScene, SystemStyleObject> = {
  [PreviewScene.Alpha]: {
    backgroundImage:
      'conic-gradient(white 90deg, #999 90deg, #999 180deg, white 180deg, white 270deg, #999 270deg, #999 360deg, white 360deg)',
    backgroundSize: '16px 16px',
    backgroundRepeat: 'repeat',
  },
  [PreviewScene.Black]: {
    backgroundColor: 'black',
  },
  [PreviewScene.White]: {
    backgroundColor: 'white',
  },
  [PreviewScene.Henesys]: {
    backgroundImage: 'henesysBackground',
  },
};
/* for panda css generate css token */
const _ = [
  css.raw(PreviewSceneBackground.alpha),
  css.raw(PreviewSceneBackground.black),
  css.raw(PreviewSceneBackground.white),
  css.raw(PreviewSceneBackground.henesys),
];

export const PreviewSceneThemeMap: Record<PreviewScene, string> = {
  [PreviewScene.Alpha]: 'light',
  [PreviewScene.Black]: 'dark',
  [PreviewScene.White]: 'light',
  [PreviewScene.Henesys]: 'light',
};
