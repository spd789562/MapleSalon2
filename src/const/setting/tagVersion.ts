/* currently observe the nameTag and madel position was change in TMS 268/269 */
export enum TagVersion {
  V1 = 'v1',
  V2 = 'v2',
}

export const TagVersionList: TagVersion[] = Object.values(TagVersion);

export function isValidTagVersion(
  tagVersion: string,
): tagVersion is TagVersion {
  return Object.values(TagVersion).includes(tagVersion as TagVersion);
}
