import { CharacterLoader } from '@/renderer/character/loader';

import { FaceColor, type FaceColorId } from '@/const/face';
import { HairColor, type HairColorId } from '@/const/hair';

export const vaildFaceColor = (id: FaceColorId): id is FaceColorId => {
  return id >= 0 && id <= 8;
};

/**
 * formatFaceId
 * @description format face id to generic face id
 * @example
 *  formatFaceId(40100) // -> 4000
 *  formatFaceId(52301) // -> 5201
 */
export const formatFaceId = (id: number) =>
  Math.floor(id / 1000) * 100 + id % 100;

/**
 * changeFormatedFaceColorId
 * @description change generic face id to other color
 * @example
 *  formatFaceId(4000, 2) // -> 40200
 *  formatFaceId(5201, 4) // -> 52401
 */
export const changeFormatedFaceColorId = (id: number, changeColorId: FaceColorId) =>
  /* 52400 + 01 */
  (Math.floor(id / 100) * 10 + changeColorId) * 100 + id % 100

/**
 * changeFaceColorId
 * @description change face id to other color
 * @example
 *  formatFaceId(40100, 2) // -> 40200
 *  formatFaceId(52301, 4) // -> 52401
 */
export const changeFaceColorId = (id: number, changeColorId: FaceColorId) =>
  /* 52400 + 01 */
  (Math.floor(id / 1000) * 10 + changeColorId) * 100 + id % 100

/**
 * getFaceColorId
 * @description get face color id
 * @example
 *  formatFaceId(40100) // -> 1
 *  formatFaceId(52301) // -> 3
 */
export const getFaceColorId = (id: number) =>
  Number(id.toString().substring(2, 3)) as FaceColorId;

/**
 * getFaceAllColorIds
 * @description get face posible colors
 * @example
 *  formatFaceId(40100) // -> [40000, 40100, 40200, 40300, 40400, 40500...]
 */
export const getFaceAllColorIds = (id: number) => {
  return Object.values(FaceColor).map((color) =>
    changeFaceColorId(id, Number(color) as FaceColorId),
  );
};

/**
 * getFaceAllColorPath
 * @description get face posible colors path to wz
 * @example
 *  getFaceAllColorPath(40100) // -> ['Character/Face/00040100.img'...]
 */
export const getFaceAllColorPath = (id: number) => {
  const allColorIds = getFaceAllColorIds(id);
  return allColorIds
    .map((colorId) => CharacterLoader.getPiecePathIfExist(colorId, 'Face/'))
    .filter(Boolean);
};

/**
 * gatFaceAvailableColorIds
 * @description get face posible and exist colors
 * @example
 *  gatFaceAvailableColorIds(40100) // -> [40000, 40100, 40200, 40300, 40400, 40500...]
 */
export const gatFaceAvailableColorIds = (id: number) => {
  const allColorIds = getFaceAllColorIds(id);
  return allColorIds.filter((colorId) =>
    CharacterLoader.getPiecePathIfExist(colorId, 'Face/'),
  );
};

export const vaildHairColor = (id: HairColorId): id is HairColorId => {
  return id >= 0 && id <= 7;
};

/**
 * formatHairId
 * @description format hair id to generic hair id
 * @example
 *  formatHairId(30000) // -> 3000
 *  formatHairId(34503) // -> 3450
 */
export const formatHairId = (id: number) => id && Math.floor(+id / 10);

/**
 * changeFormatedHairColorId
 * @description change face id to other color
 * @example
 *  formatHairId(3000, 2) // -> 30002
 *  formatHairId(3450, 4) // -> 34504
 */
export const changeFormatedHairColorId = (id: number, changeColorId: HairColorId) =>
  id * 10 + changeColorId;

/**
 * changeHairColorId
 * @description change face id to other color
 * @example
 *  formatHairId(30000, 2) // -> 30002
 *  formatHairId(34503, 4) // -> 34504
 */
export const changeHairColorId = (id: number, changeColorId: HairColorId) =>
  formatHairId(id) * 10 + changeColorId;

/**
 * getHairColorId
 * @description ge hair color id
 * @example
 *  formatHairId(30000) // -> 0
 *  formatHairId(34503) // -> 3
 */
export const getHairColorId = (id: number) => (id % 10) as HairColorId;

/**
 * getHairAllColorIds
 * @description get hair posible colors
 * @example
 *  formatHairId(34503) // -> [34500, 34501, 34502, 34503, 34504, 34505...]
 */
export const getHairAllColorIds = (id: number) => {
  return Object.values(HairColor).map((color) =>
    changeHairColorId(id, Number(color) as HairColorId),
  );
};

/**
 * getHairAllColorPath
 * @description get hair posible colors path to wz
 * @example
 *  getHairAllColorPath(34503) // -> ['Character/Hair/00034503.img'...]
 */
export const getHairAllColorPath = (id: number) => {
  const allColorIds = getHairAllColorIds(id);
  return allColorIds
    .map((colorId) => CharacterLoader.getPiecePathIfExist(colorId, 'Hair/'))
    .filter(Boolean);
};

/**
 * gatHairAvailableColorIds
 * @description get hair posible and exist colors
 * @example
 *  gatHairAvailableColorIds(34503) // -> [34500, 34501, 34502, 34503, 34504, 34505...]
 */
export const gatHairAvailableColorIds = (id: number) => {
  const allColorIds = getHairAllColorIds(id);
  return allColorIds.filter((colorId) =>
    CharacterLoader.getPiecePathIfExist(colorId, 'Hair/'),
  );
};
