import { Assets, type Texture, type UnresolvedAsset } from 'pixi.js';
import { TextureAtlas, SpineTexture } from '@esotericsoftware/spine-pixi-v8';

import type { WzPngPieceInfo, WzSpineData } from './const/wz';
import type { SpineInfo } from './const/type';
import { CharacterLoader } from '../character/loader';

export async function loadAtlasAndImage(
  wz: WzSpineData,
  prefix: string,
  info: SpineInfo,
): Promise<TextureAtlas | null> {
  const rawAtlas = wz[info.atlasFileName];

  if (!rawAtlas) {
    return null;
  }
  const hash = `${prefix}/${info.atlasFileName}`;
  if (Assets.cache.has(hash)) {
    return Assets.cache.get(hash) as TextureAtlas;
  }
  const retval = new TextureAtlas(rawAtlas as string);

  const promises = retval.pages.map(async (page) => {
    const pageName = page.name || '0';
    const pngInfo = wz[pageName] as WzPngPieceInfo;
    const url = pngInfo.path || pngInfo._outlink;
    if (!url) {
      return;
    }
    const textures = await Assets.load<Texture>({
      src: CharacterLoader.getPieceUrl(url),
      loadParser: 'loadTextures',
      format: '.webp',
    } as UnresolvedAsset);
    page.setTexture(SpineTexture.from(textures.source));
  });
  await Promise.all(promises);

  Assets.cache.set(hash, retval);

  return retval;
}
