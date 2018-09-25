function client_() {
  const settings = {
     username: "???",
     password: "???"
  }
  return new module.exports.SwgohHelpApiClient(settings)
}


function Test_fetchPlayer() {
  const allycode = 213176142
  const allycodes = [allycode, "524-173-817"]
  let json
  const client = client_()
  // interface PlayerPayload {
  //   allycodes: number | number[]  // Allycode(s) of the players to request.
  //   language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  //   enums?: boolean  // Optionally return enumerated items as their string equivalents
  //   project?: {  // Optional projection of object keys (first layer) you want returned
  //     allyCode?: number
  //     name?: number
  //     level?: number
  //     guildName?: number
  //     stats?: number
  //     roster?: number
  //     arena?: number
  //     updated?: number
  //   }
  // }
  json = client.fetchPlayer( {
    allycodes: allycode,
    project: {
      allyCode: true,
      name: true,
      level: false,
      guildName: false,
      stats: false,
      roster: false,
      arena: false,
      updated: true
    }
  } )  // lone allycode
  json = client.fetchPlayer( {
    allycodes: allycodes,
    project: {
      allyCode: true,
      name: true,
      level: false,
      guildName: false,
      stats: false,
      roster: false,
      arena: false,
      updated: true
    }
  } )  // formated string allycode
  json = client.fetchPlayer( {
    allycodes: [allycode],
    language: "eng_us",
    enums: true,
    project: {
      allyCode: true,
      name: true,
      level: false,
      guildName: false,
      stats: true,
      roster: false,
      arena: false,
      updated: true
    }
  } )
  json = client.fetchPlayer( { allycodes: allycode } )
  debugger
}


function Test_fetchGuild() {
  const allycode = 213176142
  let json
  const client = client_()
  // interface GuildPayload {
  //   allycode: number  // Allycode of any guild member in guild to request.
  //   language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  //   enums?: boolean  // Optionally return enumerated items as their string equivalents
  //   roster?: boolean  // Optionally replace guild roster with full array of player profiles
  //   units?: boolean  // (in conjunction with roster) Optionally replace guild roster with guild-wide units-report
  //   mods?: boolean  // (in conjunction with units) Optionally include unit mods in units-report
  //   project?: {  // Optional projection of object keys (first layer) you want returned
  //     name?: number
  //     desc?: number
  //     members?: number
  //     status?: number
  //     required?: number
  //     bannerColor?: number
  //     banerLogo?: number
  //     message?: number
  //     gp?: number
  //     raid?: number
  //     roster?: number
  //     updated?: number
  //   } 
  // }
  json = client.fetchGuild( {
    allycode: allycode,
    language: "eng_us",
    enums: false
  } )
  debugger
}


function Test_fetchUnits() {
  const allycode = 213176142
  let json
  const client = client_()
  // interface UnitsPayload {
  //   allycodes: number | number[]  // Allycode(s) of the players to request.
  //   mods?: boolean  // Optionally include unit-mods in report
  //   language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  //   enums?: boolean  // Optionally return enumerated items as their string equivalents
  //   project?: {  // Optional projection of object keys (first layer) you want returned
  //     player?: number
  //     allyCode?: number
  //     starLevel?: number
  //     level?: number
  //     gearLevel?: number
  //     gear?: number
  //     zetas?: number
  //     type?: number
  //     mods?: number
  //     gp?: number
  //     updated?: number
  //   } 
  // }
  json = client.fetchUnits( {
    allycodes: [allycode],
    language: "eng_us",
    enums: false
  } )
  debugger
}


function Test_fetchEvents() {
  const allycode = 213176142
  let json
  const client = client_()
  // interface EventsPayload {
  //   language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  //   enums?: boolean  // Optionally return enumerated items as their string equivalents
  //   project?: {  // Optional projection of object keys (first layer) you want returned
  //     id?: number
  //     priority?: number
  //     nameKey?: number
  //     summaryKey?: number
  //     descKey?: number
  //     instances?: number
  //     squadType?: number
  //     defensiveSquadType?: number
  //   } 
  // }
  json = client.fetchEvents( {
    allycode: allycode,
    language: "eng_us",
    enums: false
  } )
  debugger
}


function Test_fetchBattles() {
  const allycode = 213176142
  let json
  const client = client_()
  // interface BattlesPayload {
  //   language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  //   enums?: boolean  // Optionally return enumerated items as their string equivalents
  //   project?: {  // Optional projection of object keys (first layer) you want returned
  //     id?: number
  //     nameKey?: number
  //     descriptionKey?: number
  //     campaignType?: number
  //     campaignMapList?: number
  //   }
  // }
  json = client.fetchBattles( {
    allycode: allycode,
    language: "eng_us",
    enums: false
  } )
  debugger
}


function Test_fetchData() {
  let json = {}
  const client = client_()
  const collections = [
    // "abilityList",
    // "battleEnvironmentsList",
    // "battleTargetingRuleList",
    // "categoryList",
    // "challengeList",
    // "challengeStyleList",
    // "effectList",
    // "environmentCollectionList",
    // "equipmentList",
    // "eventSamplingList",
    // "guildExchangeItemList",
    // "guildRaidList",
    // "helpEntryList",
    // "materialList",
    // "playerTitleList",
    // "powerUpBundleList",
    // "raidConfigList",
    // "recipeList",
    // "requirementList",
    // "skillList",
    // "starterGuildList",
    // "statModList",
    // "statModSetList",
    // "statProgressionList",
    // "tableList",
    // "targetingSetList",
    // "territoryBattleDefinitionList",
    "territoryWarDefinitionList",
    // "unitsList",
    "unlockAnnouncementDefinitionList",
    "warDefinitionList",
    "xpTableList"
  ]
  // interface DataPayload {
  //   collection: string
  //   language?: string  // Optional language to return translated names. If no language specified, no translations will be applied
  //   enums?: boolean  // Optionally return enumerated items as their string equivalents
  //   match?: object
  //   project?: object 
  // }
  collections.forEach( e => {
    json[e] = client.fetchData( {
      collection: e,
      language: "eng_us",
      enums: false
    } )
  } )
  debugger
}
