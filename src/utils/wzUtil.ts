/**
 * get name tag color from clr, which is from wz data
 * @param clr color value need to munus from white
 */
export function getWzClrColor(clr?: number | string) {
  let _clr = -1;
  if (typeof clr === 'string') {
    const parsed = Number.parseInt(clr);
    if (!Number.isNaN(parsed)) {
      _clr = parsed;
    }
  } else if (clr && Number.isInteger(clr)) {
    _clr = clr === 0 ? -1 : clr;
  } else {
    _clr = -1;
  }
  return 0xffffff + 1 + _clr;
}
