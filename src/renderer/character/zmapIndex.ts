import type { Zmap } from './const/data';

const LAYER_PREP_REGEX = /(Below|Under|Over|Above)/gi;

export class ZmapIndex {
  indexMap = new Map<string, number>();
  zmap: Zmap;

  constructor(zmap: Zmap) {
    this.zmap = zmap;
    for (let i = 0; i < zmap.length; i++) {
      this.indexMap.set(zmap[i], i);
      if (zmap[i].length > 2) {
        this.indexMap.set(zmap[i].toLowerCase(), i);
      }
    }
    this.zmap.reverse();

    // manually add a lot of missing layer, wtf?
    this.fixLayers([
      ['accessoryFaceOverCap', 'accessoryEyeOverCap'], // 1012781
      ['backBelowBody', 'backShieldBelowBody'], // 1402233
      ['backCapAcssesary', 'backHairBelowCap'], // 1012418
      ['backCapBelowHair', 'backCap'], // 1003169
      ['backCapBelowHead', 'backMailChestOverPants'], // 1004482
      ['backCapeBelowHead', 'backMailChestOverPants'], // 1103741
      ['backWeaponBelowGlove', 'backWeaponOverGlove'], // 1472196 it a Knuckler wtf?
      ['capBelowHair', 'hairBelowBody'], // 1004506
      ['capBelowBody', 'hairBelowBody'], // 1004962
      ['capBackHair', 'hairOverHead'], // 1006737
      // v0.8.12, it looks wrong in 1003934 using the armBelowHead, so after that it move more below
      ['capBelowHead', 'capAccessoryBelowBody'], // 1003975
      ['capeArm', 'cape'], // 1103058
      ['capeBelowHair', 'hairBelowBody'], // 1102682
      ['capeBelowChest', 'mailChest'], // 1103098
      ['capeBelowBodyOverPants', 'pants'], // 1052597 it a overall...
      ['capeOverHeadOverCap', 'capAccessory'], // 1012032
      ['capeUnderBody', 'capeBelowBody'], // 1102270
      ['capeWeapon', 'weaponOverBody'], // 1702592
      ['gloveBelowHair', 'hair'], // 1082738
      ['hairBelowHead', 'mailArmBelowHead'], // 33525
      ['mailChestBelowBody', 'weaponBelowBody'], // 1053813
      ['shieldBelowArm', 'weaponBelowArm'], // 1092062
      ['weapnBelowBody', 'weaponBelowBody'], // 1702891
      ['weponBelowBody', 'weaponBelowBody'], // 1402235 what is this typo?
      ['weaponBelowArmOverHead', 'head'], // 1332168
      ['weaponBelowGlove', 'gloveWristOverBody'], // 1703541
      ['weaponBelowHand', 'weaponOverArmBelowHead'], // 1702012
      ['weaponBelowHandOverBody', 'weaponOverArmBelowHead'], // 1702288
      ['weaponBelowHead', 'weaponOverArmBelowHead'], // Blaster's weapon
      ['weaponBelowbody', 'weaponBelowBody'], // 1703234
      ['weaponBodyBelow', 'weaponBelowBody'], // 1412004
      ['weaponOverArmBelowBody', 'weaponOverArmBelowHead'], // 1342028
      ['weaponOverBelowArm', 'weaponOverArmBelowHead'], // 1703029
      ['weaponOverGloveBelowMailArm', 'mailArm'], // 1702443
      ['weaponOverHead', 'hairOverHead'], // 1703236
      ['weaponWrist', 'gloveWrist'], // 1472152
      ['weaponback', 'backWeapon'], // 1702556
      // v0.8.20
      ['weaponWristOverGloveOverArm', 'gloveWrist'],
      ['backbackWeapon', 'backWeapon'],
      ['capeOverBody', 'capAccessory'],
      ['capeBelowHead', 'capAccessory'],
      ['rglove', 'gloveWrist'],
      ['weaponEffecctOver', 'weaponOverBody'],
      ['capeOverArm', 'cape'],
    ]);

    this.zmap.push('effect');
    this.set('effect', this.zmap.length - 1);
  }

  getZIndex(names: string[]) {
    for (const name of names) {
      const index =
        this.get(name) ||
        this.get(name.toLowerCase()) ||
        this.isPossiblyResolvableLayer(name);
      if (index !== undefined && Number.isInteger(index)) {
        return index as number;
      }
    }
    return 0;
  }

  has(z: string) {
    return this.indexMap.has(z) || this.indexMap.has(z.toLowerCase());
  }

  get(z: string) {
    return this.indexMap.get(z);
  }

  set(z: string, index: number) {
    this.indexMap.set(z, index);
  }

  isPossiblyResolvableLayer(layer: string): false | number {
    const lowerCasedLayer = layer.toLowerCase();
    const hasPrep = LAYER_PREP_REGEX.test(lowerCasedLayer);
    if (!hasPrep) {
      return false;
    }
    const split = lowerCasedLayer.split(LAYER_PREP_REGEX);
    // split string must be odd like ['head', 'below', 'body']
    if (split.length % 2 === 0) {
      return false;
    }
    let index = this.get(split[0]) || 0;
    for (let i = 1; i < split.length; i += 2) {
      const prep = split[i];
      const targetIndex = this.get(split[i + 1]) || 0;
      if (prep === 'below' || prep === 'under') {
        index = targetIndex - 1;
      } else {
        index = targetIndex + 1;
      }
    }
    this.set(layer, index);
    return index;
  }

  /**
   * fix certain layer index with one exist layer when it not exist
   */
  private fixLayers(layers: [string, string][]) {
    if (!this.zmap) {
      return;
    }
    for (const [layer, alterLayer] of layers) {
      const alterIndex = this.zmap.indexOf(alterLayer);
      if (alterIndex > -1) {
        this.zmap = [
          ...this.zmap.slice(0, alterIndex),
          layer,
          ...this.zmap.slice(alterIndex),
        ];
        const alterIndexInMap = this.get(alterLayer) || 0;
        this.set(layer, alterIndexInMap);
        this.set(layer.toLowerCase(), alterIndexInMap);
      }
    }
  }
}
