interface SwgohHelpApiSettings {
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

interface GuildPayload {
  allycode: number | string  // Allycode of any guild member in guild to request.
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
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

interface UnitsPayload {
  allycodes: number | number[]  // Allycode(s) of the players to request.
  mods?: boolean  // Optionally include unit-mods in report
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
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

interface EventsPayload {
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
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

interface BattlesPayload {
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
  project?: {  // Optional projection of object keys (first layer) you want returned
    id?: boolean
    nameKey?: boolean
    descriptionKey?: boolean
    campaignType?: boolean
    campaignMapList?: boolean
  } 
}

interface DataPayload {
  collection: string
  language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  enums?: boolean  // Optionally return enumerated items as their string equivalents
  match?: object
  project?: object 
}
