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
    app.renderer.resize(
      Math.floor(container.clientWidth),
      Math.floor(container.clientHeight),
    );
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
