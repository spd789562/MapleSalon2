// hash function from https://github.com/Kagamia/MapRenderWeb/blob/master/frontend/src/index.ts#L371
export function compositezIndex(z0: number, z1?: number, z2?: number): number {
  const scale = 1 << 10; // 1024
  const normalize = (v?: number) => {
    // -512 <= v <= 511
    // v = Math.round(v || 0) + scale / 2;
    // 0 <= v <= 1023
    // v = Math.max(0, Math.min(Math.round(v || 0) + scale / 2, scale - 1));
    return Math.max(0, Math.min(Math.round(v || 0) + scale / 2, scale - 1));
  };
  return normalize(z0) * scale * scale + normalize(z1) * scale + normalize(z2);
}
