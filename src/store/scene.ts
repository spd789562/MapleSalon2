import { atom } from 'nanostores';

const IMAGE_STORE_PREFIX = 'user-upload-store';
export const IMAGE_STORE_MAX_SIZE = 16;

export const $sceneOffsetX = atom(0);
export const $sceneOffsetY = atom(0);

export const $currentSelectScene = atom<string | null>(null);
export const $userUploadedSceneImages = atom<string[][]>([]);

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
