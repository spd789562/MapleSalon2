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

export function isBackAction(action: CharacterAction) {
  return action === CharacterAction.Rope || action === CharacterAction.Ladder;
}

export function isValidAction(
  action: CharacterAction,
): action is CharacterAction {
  return Object.values(CharacterAction).includes(action);
}
