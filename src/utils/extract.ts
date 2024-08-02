import {
  unpremultiplyAlpha,
  DOMAdapter,
  GlTextureSystem,
  type Texture,
  type ExtractSystem,
  type Renderer,
} from 'pixi.js';

type ExtractTarget = Parameters<ExtractSystem['texture']>[0];

export function extractCanvas(target: ExtractTarget, renderer: Renderer) {
  const texture = renderer.extract.texture(target);

  if (renderer.texture instanceof GlTextureSystem) {
    // the webgl currently doesn't support unpremultiplyAlpha, so do it manually
    return webGLGenerateCanvas(texture, renderer.texture);
  }
  return renderer.texture.generateCanvas(texture);
}

export function webGLGenerateCanvas(
  texture: Texture,
  textureSystem: GlTextureSystem,
) {
  const { pixels, width, height } = textureSystem.getPixels(texture);
  unpremultiplyAlpha(pixels);

  const canvas = DOMAdapter.get().createCanvas();

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (ctx) {
    const imageData = ctx.createImageData(width, height);

    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}
