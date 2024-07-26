import {
  unpremultiplyAlpha,
  DOMAdapter,
  type GlTextureSystem,
  type Texture,
} from 'pixi.js';

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
