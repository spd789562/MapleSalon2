import { createSignal, onCleanup } from 'solid-js';

export const useMediaQuery = (query: string) => {
  const mediaQueryList = window.matchMedia(query);
  const [isMatch, setIsMatch] = createSignal(mediaQueryList.matches);

  function listener(event: MediaQueryListEvent) {
    setIsMatch(event.matches);
  }
  mediaQueryList.addEventListener('change', listener);

  onCleanup(() => {
    mediaQueryList.removeEventListener('change', listener);
  });

  return isMatch;
};
