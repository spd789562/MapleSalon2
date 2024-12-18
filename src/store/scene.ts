import { atom, computed } from 'nanostores';
import { PreviewScene } from '@/const/scene';

const IMAGE_STORE_PREFIX = 'user-upload-store';
export const IMAGE_STORE_MAX_SIZE = 16;

export const $sceneOffsetX = atom(0);
export const $sceneOffsetY = atom(0);
export const $sceneRepeatX = atom(true);
export const $sceneRepeatY = atom(true);

export const $currentScene = atom<PreviewScene>(PreviewScene.Color);

export const $sceneCustomColor = atom<string>('#FFFFFF');
export const $currentCustomScene = atom<string | null>(null);
export const $userUploadedSceneImages = atom<string[][]>([]);

/* selector */
export const $sceneCustomStyle = computed(
  [$currentScene, $sceneCustomColor, $currentCustomScene],
  (scene, color, customUrl) => {
    if (scene === PreviewScene.Color) {
      return {
        'background-color': color,
      };
    }
    if (scene === PreviewScene.Custom && customUrl) {
      return {
        'background-image': `url(${customUrl})`,
      };
    }
    return {};
  },
);
export const $sceneBackgroundPosition = computed(
  [$currentScene, $sceneOffsetX, $sceneOffsetY],
  (scene, offsetX, offsetY) => {
    if (scene === PreviewScene.Custom) {
      return `calc(50% + ${offsetY}px) calc(50% + ${offsetX}px)`;
    }
    return '';
  },
);
export const $sceneBackgroundRepeat = computed(
  [$currentScene, $sceneRepeatX, $sceneRepeatY],
  (scene, repeatX, repeatY) => {
    if (scene === PreviewScene.Custom) {
      return `${repeatX ? 'repeat' : 'no-repeat'} ${repeatY ? 'repeat' : 'no-repeat'}`;
    }
    return '';
  },
);
export const $isMapleMapScene = computed([$currentScene], (scene) => {
  return scene === PreviewScene.MapleMap;
});

/* action */
export function updateSceneOffsetX(value: number) {
  $sceneOffsetX.set(value);
}
export function updateSceneOffsetY(value: number) {
  $sceneOffsetY.set(value);
}
export function resetSceneOffset() {
  $sceneOffsetX.set(0);
  $sceneOffsetY.set(0);
}

export function initialUserUploadedSceneImages() {
  const order = JSON.parse(
    window.localStorage.getItem(`${IMAGE_STORE_PREFIX}-order`) || '[]',
  );
  const images = order.map((key: string) => [
    key,
    window.localStorage.getItem(`${IMAGE_STORE_PREFIX}-${key}`),
  ]);
  $userUploadedSceneImages.set(images);
}

export function refreshUploadSceneImageKeys() {
  const order = $userUploadedSceneImages.get().map(([key]) => key);
  window.localStorage.setItem(
    `${IMAGE_STORE_PREFIX}-order`,
    JSON.stringify(order),
  );
}

export function uploadSceneImage(url: string) {
  const id = Date.now().toString();
  const currentImages = $userUploadedSceneImages.get();
  const excludeKey =
    currentImages.length > IMAGE_STORE_MAX_SIZE ? currentImages[0][0] : null;
  $userUploadedSceneImages.set([
    ...currentImages.slice(-IMAGE_STORE_MAX_SIZE + 1),
    [id, url],
  ]);
  window.localStorage.setItem(`${IMAGE_STORE_PREFIX}-${id}`, url);
  if (excludeKey) {
    window.localStorage.removeItem(`${IMAGE_STORE_PREFIX}-${excludeKey}`);
  }
  refreshUploadSceneImageKeys();
}
