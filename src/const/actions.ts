import type { I18nKeys } from '@/context/i18n';

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

export const CharacterActionNames: Partial<Record<CharacterAction, I18nKeys>> =
  {
    [CharacterAction.Stand1]: 'character.actionStand1',
    [CharacterAction.Stand2]: 'character.actionStand2',
    [CharacterAction.Sit]: 'character.actionSit',
    [CharacterAction.Walk1]: 'character.actionWalk1',
    [CharacterAction.Walk2]: 'character.actionWalk2',
    [CharacterAction.Jump]: 'character.actionJump',
    [CharacterAction.Fly]: 'character.actionFly',
    [CharacterAction.Ladder]: 'character.actionLadder',
    [CharacterAction.Rope]: 'character.actionRope',
    [CharacterAction.Alert]: 'character.actionAlert',
    [CharacterAction.Heal]: 'character.actionHeal',
    [CharacterAction.Prone]: 'character.actionProne',
    [CharacterAction.ProneStab]: 'character.actionProneStab',
  };

export const ActionFrameMap: Record<CharacterAction, number> = {
  [CharacterAction.Stand1]: 4,
  [CharacterAction.Stand2]: 4,
  [CharacterAction.Walk1]: 4,
  [CharacterAction.Walk2]: 4,
  [CharacterAction.Alert]: 4,
  [CharacterAction.Fly]: 2,
  [CharacterAction.Heal]: 4,
  [CharacterAction.Jump]: 1,
  [CharacterAction.Ladder]: 2,
  [CharacterAction.Rope]: 2,
  [CharacterAction.Prone]: 1,
  [CharacterAction.ProneStab]: 2,
  [CharacterAction.Shoot1]: 3,
  [CharacterAction.Shoot2]: 5,
  [CharacterAction.ShootF]: 3,
  [CharacterAction.Sit]: 1,
  [CharacterAction.StabO1]: 2,
  [CharacterAction.StabO2]: 2,
  [CharacterAction.StabOF]: 3,
  [CharacterAction.StabT1]: 3,
  [CharacterAction.StabT2]: 3,
  [CharacterAction.StabTF]: 4,
  [CharacterAction.SwingO1]: 3,
  [CharacterAction.SwingO2]: 3,
  [CharacterAction.SwingO3]: 3,
  [CharacterAction.SwingOF]: 4,
  [CharacterAction.SwingP1]: 3,
  [CharacterAction.SwingP2]: 3,
  [CharacterAction.SwingPF]: 4,
  [CharacterAction.SwingT1]: 3,
  [CharacterAction.SwingT2]: 3,
  [CharacterAction.SwingT3]: 3,
  [CharacterAction.SwingTF]: 4,
};

export const CharacterSpecialActionNames: Record<
  CharacterSpecialAction,
  I18nKeys
> = {
  stand1_floating: 'character.actionStand1Floading',
  stand2_floating: 'character.actionStand2Floading',
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
