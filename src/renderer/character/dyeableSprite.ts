import {
  Container,
  Assets,
  Mesh,
  Geometry,
  Texture,
  Shader,
  type DestroyOptions,
} from 'pixi.js';

import type { CharacterItem } from './item';

import { replaceIdInPath } from '@/utils/itemId';

import { CharacterLoader } from './loader';

import mixDyeVertGlsl from './shaders/mixDyeVert.vert';
import mixDyeFragGlsl from './shaders/mixDyeFrag.frag';
import mixDyeVertWgsl from './shaders/mixDye.wgsl';

/** a special sprite contain to sprite for dyablePiece  */
export class DyeableSprite extends Container {
  item: CharacterItem;
  mainUrl: string;

  private basicGeometry: Geometry;
  private mixDyeShader: Shader;
  private mesh: Mesh<Geometry, Shader>;

  private mainTexture: Texture;
  private dyeTexture: Texture;

  private prevDyeId: number | undefined = undefined;

  private failedToGetDye = false;

  constructor(item: CharacterItem, mainUrl: string) {
    super();
    this.item = item;
    this.mainUrl = mainUrl;

    this.mainTexture = Texture.from(mainUrl);
    this.dyeTexture = Texture.from(mainUrl);

    this.basicGeometry = new Geometry({
      attributes: {
        aPosition: [
          0,
          0,
          this.mainTexture.width,
          0,
          this.mainTexture.width,
          this.mainTexture.height,
          0,
          this.mainTexture.height,
        ],
        aUV: [0, 0, 1, 0, 1, 1, 0, 1],
      },
      indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3]),
    });
    this.mixDyeShader = Shader.from({
      gl: {
        vertex: mixDyeVertGlsl,
        fragment: mixDyeFragGlsl,
      },
      gpu: {
        vertex: {
          entryPoint: 'mainVert',
          source: mixDyeVertWgsl,
        },
        fragment: {
          entryPoint: 'mainFrag',
          source: mixDyeVertWgsl,
        },
      },
      resources: {
        uTexture1: this.mainTexture.source,
        uTexture2: this.mainTexture.source,
        uSampler1: this.mainTexture.source.style,
        uSampler2: this.mainTexture.source.style,
        mixDyeUniforms: {
          uAlpha: { value: 0.5, type: 'f32' },
          uSameTexture: { value: 0, type: 'f32' },
        },
      },
    });
    this.mesh = new Mesh({
      geometry: this.basicGeometry,
      shader: this.mixDyeShader,
    });
    this.addChild(this.mesh);
  }
  async updateDye() {
    const dyeId = this.dyeId;
    const isNeedToLoad = this.prevDyeId !== dyeId;
    if (isNeedToLoad) {
      this.failedToGetDye = false;
      await this.loadDyeAssets();
      this.prevDyeId = dyeId;
    }
    const dyePath = this.dyePath;
    /* if dye piece load faild then just render mainSprite */
    if (!dyePath || this.failedToGetDye || !this.item.info.dye) {
      this.dyeTexture = this.mainTexture;
      this.mixDyeShader.resources.uTexture2 = this.mainTexture.source;
      this.mixDyeShader.resources.uSampler2 = this.mainTexture.source.style;
      this.mixDyeShader.resources.mixDyeUniforms.uniforms.uSameTexture = 1;
      return;
    }

    if (isNeedToLoad) {
      this.dyeTexture = Texture.from(dyePath);
      this.mixDyeShader.resources.uTexture2 = this.dyeTexture.source;
      this.mixDyeShader.resources.uSampler2 = this.dyeTexture.source.style;
      this.mixDyeShader.resources.mixDyeUniforms.uniforms.uSameTexture = 0;
    }

    if (this.dyeTexture !== this.mainTexture) {
      this.mixDyeShader.resources.mixDyeUniforms.uniforms.uAlpha =
        this.item.info.dye.alpha / 100;
    }
  }
  get dyeId() {
    if (this.item.info.dye === undefined) {
      return undefined;
    }
    return this.item.avaliableDye.get(this.item.info.dye.color);
  }
  get dyePath() {
    const dyeId = this.dyeId;
    if (!dyeId) {
      return undefined;
    }
    return replaceIdInPath(this.mainUrl, dyeId);
  }
  async loadDyeAssets() {
    if (!this.item.info.dye) {
      return;
    }
    const dyeId = this.item.avaliableDye.get(this.item.info.dye?.color);
    if (!dyeId) {
      return;
    }
    const dyeUrl = replaceIdInPath(this.mainUrl, dyeId);
    try {
      await Assets.load({
        alias: dyeUrl,
        /* if image is under _Canvas, it sometime can't change id directly, 
           so use normal path here and let it _oulink to dest path
         */
        src: CharacterLoader.getPieceUrl(dyeUrl.replace('_Canvas/', '')),
        loadParser: 'loadTextures',
        format: '.webp',
      });
    } catch (e) {
      this.failedToGetDye = true;
    }
  }

  destroy(options?: DestroyOptions) {
    super.destroy(options);
    // @ts-ignore
    this.mesh = undefined;
    // @ts-ignore
    this.mainTexture = undefined;
    // @ts-ignore
    this.dyeTexture = undefined;
    // @ts-ignore
    this.basicGeometry = undefined;
  }
}
