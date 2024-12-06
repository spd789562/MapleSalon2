export enum SpineVersion {
  V2 = 'V2',
  V3 = 'V3',
  V4 = 'V4',
}

export enum SpineType {
  Binary = 'binary',
  Json = 'json',
}

export interface SpineInfo {
  type: SpineType;
  spineFileName: string;
  atlasFileName: string;
}
