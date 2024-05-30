/** the required slot of an item  */
export type PieceIslot =
  | 'Bd' // body
  | 'Hd' // head
  | 'Hr' // hair
  | 'Fc' // face
  | 'At'
  | 'Af'
  | 'Am'
  | 'Ae'
  | 'As'
  | 'Ay'
  | 'Cp' // cap
  | 'Ri' // ring
  | 'Gv' // glove
  | 'Wp' // weapon
  | 'Si' // shield
  | 'So' // shoes
  | 'Pn' // pants
  | 'Ws'
  | 'Ma' // mask
  | 'Wg' // wing
  | 'Sr' // shoulder
  | 'Tm' // Taming Mob
  | 'Sd';

/** the slot will block by current item */
export type PieceVslot = string;
