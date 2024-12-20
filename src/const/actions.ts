export enum CharacterAction {
  Stand1 = 'stand1',
  Stand2 = 'stand2',
  Walk1 = 'walk1',
  Walk2 = 'walk2',
  Alert = 'alert',
  Fly = 'fly',
  Heal = 'heal',
  Jump = 'jump',
  Ladder = 'ladder',
  Rope = 'rope',
  Prone = 'prone',
  ProneStab = 'proneStab',
  Shoot1 = 'shoot1',
  Shoot2 = 'shoot2',
  ShootF = 'shootF',
  Sit = 'sit',
  StabO1 = 'stabO1',
  StabO2 = 'stabO2',
  StabOF = 'stabOF',
  StabT1 = 'stabT1',
  StabT2 = 'stabT2',
  StabTF = 'stabTF',
  SwingO1 = 'swingO1',
  SwingO2 = 'swingO2',
  SwingO3 = 'swingO3',
  SwingOF = 'swingOF',
  SwingP1 = 'swingP1',
  SwingP2 = 'swingP2',
  SwingPF = 'swingPF',
  SwingT1 = 'swingT1',
  SwingT2 = 'swingT2',
  SwingT3 = 'swingT3',
  SwingTF = 'swingTF',
}

const validAction = {
  [CharacterAction.Stand1]: 'Stand1',
  [CharacterAction.Stand2]: 'Stand2',
  [CharacterAction.Walk1]: 'Walk1',
  [CharacterAction.Walk2]: 'Walk2',
  [CharacterAction.Alert]: 'Alert',
  [CharacterAction.Fly]: 'Fly',
  [CharacterAction.Heal]: 'Heal',
  [CharacterAction.Jump]: 'Jump',
  [CharacterAction.Ladder]: 'Ladder',
  [CharacterAction.Rope]: 'Rope',
  [CharacterAction.Prone]: 'Prone',
  [CharacterAction.ProneStab]: 'ProneStab',
  [CharacterAction.Shoot1]: 'Shoot1',
  [CharacterAction.Shoot2]: 'Shoot2',
  [CharacterAction.ShootF]: 'ShootF',
  [CharacterAction.Sit]: 'Sit',
  [CharacterAction.StabO1]: 'StabO1',
  [CharacterAction.StabO2]: 'StabO2',
  [CharacterAction.StabOF]: 'StabOF',
  [CharacterAction.StabT1]: 'StabT1',
  [CharacterAction.StabT2]: 'StabT2',
  [CharacterAction.StabTF]: 'StabTF',
  [CharacterAction.SwingO1]: 'SwingO1',
  [CharacterAction.SwingO2]: 'SwingO2',
  [CharacterAction.SwingO3]: 'SwingO3',
  [CharacterAction.SwingOF]: 'SwingOF',
  [CharacterAction.SwingP1]: 'SwingP1',
  [CharacterAction.SwingP2]: 'SwingP2',
  [CharacterAction.SwingPF]: 'SwingPF',
  [CharacterAction.SwingT1]: 'SwingT1',
  [CharacterAction.SwingT2]: 'SwingT2',
  [CharacterAction.SwingT3]: 'SwingT3',
  [CharacterAction.SwingTF]: 'SwingTF',
};

export type CharacterSpecialAction = string;

export const CharacterActionNames: Partial<Record<CharacterAction, string>> = {
  [CharacterAction.Stand1]: '站立',
  [CharacterAction.Stand2]: '站立(雙手)',
  [CharacterAction.Sit]: '坐下',
  [CharacterAction.Walk1]: '走路',
  [CharacterAction.Walk2]: '走路(雙手)',
  [CharacterAction.Jump]: '跳躍',
  [CharacterAction.Fly]: '飛行/游泳',
  [CharacterAction.Ladder]: '攀爬(梯子)',
  [CharacterAction.Rope]: '攀爬(繩子)',
  [CharacterAction.Alert]: '警戒',
  [CharacterAction.Heal]: '施放',
  [CharacterAction.Prone]: '趴下',
  [CharacterAction.ProneStab]: '趴下攻擊',
};

export const CharacterSpecialActionNames: Record<
  CharacterSpecialAction,
  string
> = {
  stand1_floating: '漂浮(單手)',
  stand2_floating: '漂浮(雙手)',
};

export const GunActions: CharacterAction[] = [
  CharacterAction.Stand1,
  CharacterAction.Walk1,
  CharacterAction.Alert,
  CharacterAction.Fly,
  CharacterAction.Jump,
  CharacterAction.Prone,
  CharacterAction.ProneStab,
  CharacterAction.Shoot2,
  CharacterAction.StabO1,
  CharacterAction.StabO2,
  CharacterAction.StabT2,
  CharacterAction.SwingO3,
  CharacterAction.SwingOF,
  CharacterAction.SwingP1,
  CharacterAction.SwingP2,
  CharacterAction.SwingPF,
  CharacterAction.SwingT1,
  CharacterAction.SwingT2,
  CharacterAction.SwingT3,
];

export function isDoubleHandAction(action: CharacterAction) {
  return action === CharacterAction.Walk2 || action === CharacterAction.Stand2;
}
export function isSingalHandAction(action: CharacterAction) {
  return action === CharacterAction.Walk1 || action === CharacterAction.Stand1;
}

export function isBackAction(action: CharacterAction) {
  return action === CharacterAction.Rope || action === CharacterAction.Ladder;
}

export function isValidAction(action: string): action is CharacterAction {
  return action in validAction;
}
