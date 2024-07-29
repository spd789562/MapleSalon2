import { onCleanup } from 'solid-js';

export function horizontalScroll(element: Element) {
  function hanedleHorizontalScroll(e: Event) {
    const scrollAble = element.scrollWidth - element.clientWidth;
    if (!scrollAble) {
      return;
    }
    e.preventDefault();
    if ((e as WheelEvent).deltaY === 0) {
      return;
    }
    element.scrollLeft += (e as WheelEvent).deltaY;
  }
  element.addEventListener('wheel', hanedleHorizontalScroll);
  onCleanup(() => {
    element.removeEventListener('wheel', hanedleHorizontalScroll);
  });
}
