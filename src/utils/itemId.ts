export enum Gender {
  Male = 0,
  Female = 1,
  Share = 2,
}

export function isFaceId(id: number): boolean {
  return (id >= 20000 && id < 30000) || (id >= 50000 && id < 60000);
}

export function isHairId(id: number): boolean {
  return (id >= 30000 && id < 50000) || (id >= 60000 && id < 70000);
}

export function isCapId(id: number): boolean {
  return id / 10000 === 100;
}

export function isCoatId(id: number): boolean {
  return id / 10000 === 104;
}

export function isLongcoatId(id: number): boolean {
  return id / 10000 === 105;
}

export function isPantsId(id: number): boolean {
  return id / 10000 === 106;
}

export function isShoesId(id: number): boolean {
  return id / 10000 === 107;
}

export function isGloveId(id: number): boolean {
  return id / 10000 === 108;
}

export function isShieldId(id: number): boolean {
  return id / 10000 === 109;
}

export function isCapeId(id: number): boolean {
  return id / 10000 === 110;
}

export function getGender(id: number): Gender {
  const tag = (id / 1000) % 10;
  switch (tag) {
    case 0:
    case 3:
    case 5:
    case 6: {
      return Gender.Male;
    }
    case 1:
    case 4:
    case 7:
    case 8: {
      return Gender.Female;
    }
    default:
      return Gender.Share;
  }
}
