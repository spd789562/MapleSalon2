import type { SystemStyleObject } from 'styled-system/types';

export enum PreviewScene {
  Alpha = 'alpha',
  Black = 'black',
  White = 'white',
}

export const PreviewSceneNames: Record<PreviewScene, string> = {
  [PreviewScene.Alpha]: '透明背景',
  [PreviewScene.Black]: '黑色背景',
  [PreviewScene.White]: '白色背景',
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
};
