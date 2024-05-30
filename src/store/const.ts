import { atom, computed } from 'nanostores';

export const $isInitialized = atom<boolean>(false);

export const $apiHost = atom<string>('');

export const $wzReady = computed(
  [$isInitialized, $apiHost],
  (initialized, host) => initialized && host.length > 0,
);
