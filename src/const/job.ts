export enum JobType {
  Worriror = '1',
  Magician = '2',
  Bowman = '3',
  Thief = '4',
  Pirate = '5',
}

export enum JobStage {
  Th2 = '10',
  Th3 = '11',
  Th4 = '12',
  Th6 = '14',
}

export enum Job {
  /** adventurer **/
  Beginner = '000',
  /* worrior */
  Swordman = '100',
  // heros
  Fighter = '110',
  Crusader = '111',
  Hero = '112',
  // paladins
  Page = '120',
  WhiteKnight = '121',
  Paladin = '122',
  // dark knights
  Spearman = '130',
  Berserker = '131', // Dragon Knight
  DarkKnight = '132',
  /* worrior end */
  /* magician */
  Magician = '200',
  // fire/poison
  FirePoisonWizard = '210',
  FirePoisonMage = '211',
  FirePoisonArchMage = '212',
  // ice/lightning
  IceLightningWizard = '220',
  IceLightningMage = '221',
  IceLightningArchMage = '222',
  // bishop
  Cleric = '230',
  Priest = '231',
  Bishop = '232',
  /* magician end */

  /* bowman */
  Archer = '300',
  // bow master
  Hunter = '310',
  Ranger = '311',
  BowMaster = '312',
  // marksman
  CrossbowMan = '320',
  Sniper = '321',
  Marksman = '322',
  // pathfinder
  Pathfinder = '301',
  Pathfinder2th = '330',
  Pathfinder3th = '331',
  Pathfinder4th = '332',
  /* bowman end */

  /* thief */
  Rogue = '400',
  /* night nord */
  Assassin = '410',
  Hermit = '411',
  NightLord = '412',
  /* shadower */
  Bandit = '420',
  ChiefBandit = '421',
  Shadower = '422',
  /* blade master */
  BladeRecruit = '430',
  BladeAcolyte = '431',
  BladeSpecialist = '432',
  BladeLord = '433',
  BladeMaster = '434',
  /* thief end */

  /* pirate */
  Pirate = '500',
  // buccaneer
  Brawler = '510',
  Marauder = '511',
  Buccaneer = '512',
  Buccaneer6th = '534',
  // corsair
  Gunslinger = '520',
  Outlaw = '521',
  Corsair = '522',
  Corsair6th = '534',
  // cannon master
  Cannoneer = '501',
  Cannoneer2th = '530',
  CannonTrooper = '531',
  CannonMaster = '532',
  CannonMaster6th = '534',
  /* pirate end */
  /** adventurer end **/

  /** cygnus knight **/
  Noblesse = '1000',

  DawnWarrior = '1100',

  BlazeWizard = '1200',

  WindArcher = '1300',

  NightWalker = '1400',

  ThunderBreaker = '1500',

  Mihile0th = '5000',
  Mihile = '5100',
  /** cygnus knight end **/

  /** hero **/
  Aran0th = '2000',
  Aran = '2100',

  Evan0th = '2001',
  Evan = '2200',

  Mercedes0th = '2002',
  Mercedes = '2300',

  Phantom0th = '2003',
  Phantom = '2400',

  Luminous0th = '2004',
  Luminous = '2700',

  Shade0th = '2005', // -> ??
  Shade = '2500',
  /** hero end **/

  /** resistance **/
  Citizen = '3000',

  DemonSlayer0th = '3001',
  DemonSlayer = '3100',

  DemonAvenger = '3101',
  DemonAvenger2th = '3120',
  DemonAvenger3th = '3121',
  DemonAvenger4th = '3122',

  BattleMage = '3200',

  WildHunter = '3300',

  Mechanic = '3500',

  Xenon = '3600',

  Blaster = '3700',
  /** resistance end **/

  /** sengoku **/
  Hayato0th = '4001',
  Hayato = '4100',

  Kanna0th = '4002',
  Kanna = '4200',
  /** sengoku end **/

  /** nova **/
  Kaiser0th = '6000',
  Kaiser = '6100',

  AngelicBuster0th = '6001',
  AngelicBuster = '6500',

  Cadena0th = '6002',
  Cadena = '6400',

  Kain0th = '6003',
  Kain = '6300',
  /** nova end **/

  /** flora **/
  Illium0th = '15000',
  Illium = '15200',

  Ark0th = '15001',
  Ark = '15500',

  Adele0th = '15002',
  Adele = '15100',

  Khali0th = '15003',
  Khali = '15400',
  /** flora end **/

  /** anima **/
  Hoyoung0th = '16000',
  Hoyoung = '16400',

  Lara0th = '16001',
  Lara = '16200',
  /** anima end **/

  /** child of god(超越者) **/
  Zero0th = '10000',
  Zero = '10100',
  /** child of god end **/

  /** kinesis **/
  Kinesis0th = '14000',
  Kinesis = '14200',
  /** kinesis end **/

  /** jianghu **/
  MoXuan0th = '17000',
  MoXuan = '17500',

  Lynn0th = '17001',
  Lynn = '17200',
  /** jianghu end **/

  /** other **/
  BeastTamer0th = '11000',
  BeastTamer = '11200',

  // is this same as tms's Zen?
  Jett0th = '508',
  Jett = '570',

  FifthJobShare = '40000',
  FifthJobWorriror = '40001',
  FifthJobMagician = '40002',
  FifthJobBowman = '40003',
  FifthJobThief = '40004',
  FifthJobPirate = '40005',

  SixJobShare = '50000',
  SixJobEnchant = '50006',
  SixJobHexa = '50007',
  /** other end **/

  /** event **/
  PinkBean0th = '13000',
  PinkBean = '13100',

  Yeti0th = '13001',
  Yeti = '13500',
  /** event end **/
}
