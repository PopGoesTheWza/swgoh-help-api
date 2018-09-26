/**
 * SWGoH.help API client settings
 */
interface SwgohHelpApiSettings {
  readonly username: string
  readonly password: string
  readonly client_id?: string
  readonly client_secret?: string
  readonly protocol?: string
  readonly host?: string
  readonly port?: string
}


/**
 * Common attributes to all SWGoH.help payloads
 */
interface CommonPayload {
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
}

/**
 * Payload to /swgoh/player endpoint
 */
interface PlayerPayload extends CommonPayload {
  allycodes: number | number[]  // Allycode(s) of the players to request.
  project?: {  // Optional projection of object keys (first layer) you want returned
    allyCode?: boolean
    name?: boolean
    level?: boolean
    guildName?: boolean
    stats?: boolean
    roster?: boolean
    arena?: boolean
    updated?: boolean
  } 
}

/**
 * Payload to /swgoh/guild endpoint
 */
interface GuildPayload extends CommonPayload {
  allycode: number | string  // Allycode of any guild member in guild to request.
  roster?: boolean  // Optionally replace guild roster with full array of player profiles
  units?: boolean  // (in conjunction with roster) Optionally replace guild roster with guild-wide units-report
  mods?: boolean  // (in conjunction with units) Optionally include unit mods in units-report
  project?: {  // Optional projection of object keys (first layer) you want returned
    name?: boolean
    desc?: boolean
    members?: boolean
    status?: boolean
    required?: boolean
    bannerColor?: boolean
    banerLogo?: boolean
    message?: boolean
    gp?: boolean
    raid?: boolean
    roster?: boolean
    updated?: boolean
  } 
}

/**
 * Payload to /swgoh/units endpoint
 */
interface UnitsPayload extends CommonPayload {
  allycodes: number | number[]  // Allycode(s) of the players to request.
  mods?: boolean  // Optionally include unit-mods in report
  project?: {  // Optional projection of object keys (first layer) you want returned
    player?: boolean
    allyCode?: boolean
    starLevel?: boolean
    level?: boolean
    gearLevel?: boolean
    gear?: boolean
    zetas?: boolean
    type?: boolean
    mods?: boolean
    gp?: boolean
    updated?: boolean
  } 
}

/**
 * Payload to /swgoh/events endpoint
 */
interface EventsPayload extends CommonPayload {
  project?: {  // Optional projection of object keys (first layer) you want returned
    id?: boolean
    priority?: boolean
    nameKey?: boolean
    summaryKey?: boolean
    descKey?: boolean
    instances?: boolean
    squadType?: boolean
    defensiveSquadType?: boolean
  } 
}

/**
 * Payload to /swgoh/battles endpoint
 */
interface BattlesPayload extends CommonPayload {
  project?: {  // Optional projection of object keys (first layer) you want returned
    id?: boolean
    nameKey?: boolean
    descriptionKey?: boolean
    campaignType?: boolean
    campaignMapList?: boolean
  } 
}

/**
 * Payload to /swgoh/data endpoint
 */
interface DataPayload extends CommonPayload {
  collection: string
  match?: object
  project?: object 
}


/**
 * Response data structures
 */
interface PlayerObject {
  allycode?: number
  name?: string
  level?: number
  guildname?: string
  guildRefId?: string
  stats?: StatsObject[]
  roster?: RosterObject[]
  arena?: {
    char: ArenaObject[]
    ship: ArenaObject[]
  }
  updated?: number
}

interface GuildObject {
  updated?: number
  id: string
  roster: MemberObject[]
  name?: string
  desc?: string
  members?: number
  status?: number
  required?: number
  bannerColor?: string
  bannerLogo?: string
  message?: string
  gp?: number
  raid?: {
    aat: string
    rancor: string
    sith_raid: string
  }
}

interface MemberObject {
  allycode: number
  name: string
  level: number
  updated: number
  guildMemberLevel: number
  gp: number
}

interface StatsObject {
  index: number
  nameKey: string
  value: number
}

interface UnitObject {
  id: string
  defId: string
  type: number
}

interface RosterObject extends UnitObject {
  rarity: number
  level: number
  xp: number
  gear: number
  equipped: EquippedObject[]
  skills: SkillsObject[]
  mods: ModsObject[]
  crew: CrewObject[]
  gp: number
}

interface EquippedObject {
  equipmentId: string
  slot: number
}

interface SkillsObject {
  id: string
  tier: number
  isZeta: boolean
}

interface ModsObject {
  id: string
  level: number
  tier: number
  slot: number
  set: number
  pips: number
  primaryBonusType: number
  primaryBonusValue: number
  secondaryType_1: number
  secondaryValue_1: number
  secondaryRoll_1: number
  secondaryType_2: number
  secondaryValue_2: number
  secondaryRoll_2: number
  secondaryType_3: number
  secondaryValue_3: number
  secondaryRoll_3: number
  secondaryType_4: number
  secondaryValue_4: number
  secondaryRoll_4: number
}

interface CrewObject {
  unitId: string
  slot: number
  skillReferenceList: string[]
  cp: number
  gp: number
}

interface ArenaObject {
  rank: number
  squad: UnitObject[]
}

interface UnitObject {
  id: string
  defId: string
  type: number
}

// interface UnitsObject {
// }

// interface EventsObject {
// }

// interface BattlesObject {
// }
