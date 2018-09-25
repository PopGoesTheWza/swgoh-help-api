interface Settings {
  readonly username: string
  readonly password: string
  readonly client_id?: string
  readonly client_secret?: string
  readonly protocol?: string
  readonly host?: string
  readonly port?: string
}

interface PlayerPayload {
  allycodes: number | number[]  // Allycode(s) of the players to request.
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
  project?: {  // Optional projection of object keys (first layer) you want returned
    allyCode?: number
    name?: number
    level?: number
    guildName?: number
    stats?: number
    roster?: number
    arena?: number
    updated?: number
  } 
}

interface GuildPayload {
  allycode: number  // Allycode of any guild member in guild to request.
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
  roster?: boolean  // Optionally replace guild roster with full array of player profiles
  units?: boolean  // (in conjunction with roster) Optionally replace guild roster with guild-wide units-report
  mods?: boolean  // (in conjunction with units) Optionally include unit mods in units-report
  project?: {  // Optional projection of object keys (first layer) you want returned
    name?: number
    desc?: number
    members?: number
    status?: number
    required?: number
    bannerColor?: number
    banerLogo?: number
    message?: number
    gp?: number
    raid?: number
    roster?: number
    updated?: number
  } 
}

interface UnitsPayload {
  allycodes: number | number[]  // Allycode(s) of the players to request.
  mods?: boolean  // Optionally include unit-mods in report
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
  project?: {  // Optional projection of object keys (first layer) you want returned
    player?: number
    allyCode?: number
    starLevel?: number
    level?: number
    gearLevel?: number
    gear?: number
    zetas?: number
    type?: number
    mods?: number
    gp?: number
    updated?: number
  } 
}

interface EventsPayload {
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
  project?: {  // Optional projection of object keys (first layer) you want returned
    id?: number
    priority?: number
    nameKey?: number
    summaryKey?: number
    descKey?: number
    instances?: number
    squadType?: number
    defensiveSquadType?: number
  } 
}

interface BattlesPayload {
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
  project?: {  // Optional projection of object keys (first layer) you want returned
    id?: number
    nameKey?: number
    descriptionKey?: number
    campaignType?: number
    campaignMapList?: number
  } 
}

interface DataPayload {
  collection: string
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
  match?: object
  project?: object 
}
