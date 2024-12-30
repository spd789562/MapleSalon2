import { type Accessor, onCleanup, onMount } from 'solid-js';
import { $globalRenderer } from '@/store/renderer';
import type { ZoomContainer } from '@/renderer/ZoomContainer';

export interface ResizableAppProps {
  viewport?: ZoomContainer;
  container: Accessor<HTMLDivElement>;
}
export function useResizableApp(props: ResizableAppProps) {
  const observer = new ResizeObserver(handleCanvasResize);

  function handleCanvasResize() {
    const app = $globalRenderer.get();
    const container = props.container();
    const w = Math.floor(container.clientWidth);
    const h = Math.floor(container.clientHeight);
    app.renderer.resize(w % 2 === 0 ? w : w + 1, h % 2 === 0 ? h : h + 1);
    props.viewport?.resizeScreen(app.screen.width, app.screen.height);
  }

  onMount(() => {
    observer.observe(props.container());
  });

  onCleanup(() => {
    observer.disconnect();
  });

  return observer;
}
