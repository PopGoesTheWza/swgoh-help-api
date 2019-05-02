// tslint:disable-next-line:max-line-length
import { BattlesResponse, Client, Collections, EventsResponse, GuildResponse, Languages, PlayerRequest, PlayerResponse, Settings, UnitsResponse } from './index';

/**
 * Helper function to instanciate a swgoh.help API client
 * The `username` and `password`properties should be edited with you swgoh.help API credentials
 */
function client_(): Client {
  const settings: Settings = {
    username: '???',
    password: '???',
  };

  return new Client(settings);
}

/** Sample invokation of the /swgoh/player endpoint */
function test_fetchPlayer() {
  const allycode = 213176142;
  const allycodes = [allycode, 524173817];
  let request: PlayerRequest;
  let json: PlayerResponse[];
  const client = client_();

  request = {
    allycodes: allycode, // lone allycode
    project: {
      allyCode: true,
      name: true,
      updated: true,
    },
  };
  client.fetchPlayer(request);

  request = {
    allycodes, // array of allycodes
    project: {
      allyCode: true,
      name: true,
      updated: true,
    },
  };
  json = client.fetchPlayer(request);
  debugger;

  return json;
}

/** Sample invokation of the /swgoh/guild endpoint */
function test_fetchGuild() {
  const allycode = 213176142;
  let json: GuildResponse[];
  const client = client_();

  json = client.fetchGuild({
    allycode,
    language: Languages.eng_us,
  });
  debugger;

  return json;
}

/** Sample invokation of the /swgoh/units endpoint */
function test_fetchUnits() {
  const allycode = 213176142;
  let json: UnitsResponse;
  const client = client_();

  json = client.fetchUnits({
    allycodes: allycode,
    language: Languages.eng_us,
  });
  debugger;

  return json;
}

/** Sample invokation of the /swgoh/events endpoint */
function test_fetchEvents() {
  let json: EventsResponse;
  const client = client_();

  json = client.fetchEvents({
    language: Languages.eng_us,
  });
  debugger;

  return json;
}

/** Sample invokation of the /swgoh/battles endpoint */
function test_fetchBattles() {
  let json: BattlesResponse;
  const client = client_();

  json = client.fetchBattles({
    language: Languages.eng_us,
  });
  debugger;

  return json;
}

/** Sample invokation of the /swgoh/data endpoint */
function test_fetchData(): void {
  const json: object = {};
  const client = client_();
  const collections: Collections[] = [
    // Collections.abilityList,
    // Collections.battleEnvironmentsList,
    // Collections.battleTargetingRuleList,
    // Collections.categoryList,
    // Collections.challengeList,
    // Collections.challengeStyleList,
    // Collections.effectList,
    // Collections.environmentCollectionList,
    // Collections.equipmentList,
    // Collections.eventSamplingList,
    // Collections.guildExchangeItemList,
    // Collections.guildRaidList,
    // Collections.helpEntryList,
    // Collections.materialList,
    // Collections.playerTitleList,
    // Collections.powerUpBundleList,
    // Collections.raidConfigList,
    // Collections.recipeList,
    // Collections.requirementList,
    // Collections.skillList,
    // Collections.starterGuildList,
    // Collections.statModList,
    // Collections.statModSetList,
    // Collections.statProgressionList,
    // Collections.tableList,
    // Collections.targetingSetList,
    // Collections.territoryBattleDefinitionList,
    Collections.territoryWarDefinitionList,
    // Collections.unitsList,
    Collections.unlockAnnouncementDefinitionList,
    Collections.warDefinitionList,
    Collections.xpTableList,
  ];

  for (const e of collections) {
    json[e] = client.fetchData({
      collection: e,
      language: Languages.eng_us,
      enums: false,
    });
  }
  debugger;
}
