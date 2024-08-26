import {
  WebGPURenderer,
  WebGLRenderer,
  extensions,
  ExtensionType,
  type InstructionSet,
  type InstructionPipe,
  type Renderer,
  type RenderContainer,
} from 'pixi.js';

import type { Anime4kContainer } from './Anime4kContainer';

export class Anime4kRenderPipe implements InstructionPipe<Anime4kContainer> {
  public static extension = {
    type: [ExtensionType.WebGPUPipes],
    name: 'anime4kRender',
  } as const;

  private _renderer: Renderer;

  constructor(renderer: Renderer) {
    this._renderer = renderer;
  }

  public addRenderable(
    container: Anime4kContainer,
    instructionSet: InstructionSet,
  ): void {
    this._renderer.renderPipes.batch.break(instructionSet);

    instructionSet.add(container);
  }

  public execute(container: Anime4kContainer) {
    if (!container.isRenderable) {
      return;
    }
    container.render(this._renderer);
  }

  public destroy(): void {
    /* @ts-ignore */
    this._renderer = null;
  }
}

extensions.add(Anime4kRenderPipe);
