// code from https://stackoverflow.com/a/23329386
export function byteLength(str: string) {
  // returns the byte length of an utf8 string
  let len = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) {
      len += 1;
    } else if (code > 0x7ff && code <= 0xffff) {
      len += 2;
    }
    //trail surrogate
    if (code >= 0xdc00 && code <= 0xdfff) {
      len -= 1;
    }
  }
  return len;
}
