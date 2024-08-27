declare global {
  namespace PixiMixins {
    interface RendererSystems {
      anime4k: import('./Anime4kSystem').Anime4kFilterSystem;
    }
  }
}

export {};
