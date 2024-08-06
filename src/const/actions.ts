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

export function isDoubleHandAction(action: CharacterAction) {
  return action === CharacterAction.Walk2 || action === CharacterAction.Stand2;
}
export function isSingalHandAction(action: CharacterAction) {
  return action === CharacterAction.Walk1 || action === CharacterAction.Stand1;
}

export function isBackAction(action: CharacterAction) {
  return action === CharacterAction.Rope || action === CharacterAction.Ladder;
}

export function isValidAction(
  action: CharacterAction,
): action is CharacterAction {
  return Object.values(CharacterAction).includes(action);
}
