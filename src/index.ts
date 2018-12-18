/** SWGoH.help API client for Google Apps Script (GAS) */

const VERSION = '1.0.5_beta';
const RELEASE = `SwgohHelp API for GAS (${VERSION})`;

/**
 * SWGoH.help API client class.
 *
 * Available methods:
 * - client.fetchPlayer(payload: PlayerRequest): PlayerResponse
 * - client.fetchGuild(payload: GuildRequest): GuildResponse
 * - client.fetchUnits(payload: UnitsRequest): UnitsResponse
 * - client.fetchEvents(payload: EventsRequest): EventsResponse
 * - client.fetchBattles(payload: BattlesRequest): BattlesResponse
 * - client.fetchData(payload: <DataRequest>): <DataResponse>
 */
export class Client {
  /** Sealed copy of the Client instance Settings */
  private readonly settings: Settings;
  /** URL to the login endpoint */
  private readonly signinUrl: string;
  /** URL to the player endpoint */
  private readonly endpointUrl: (string) => string;
  /** URL to the player endpoint */
  private readonly playersUrl: string;
  /** URL to the guild endpoint */
  private readonly guildsUrl: string;
  /** URL to the units endpoint */
  private readonly unitsUrl: string;
  /** URL to the events endpoint */
  private readonly eventsUrl: string;
  /** URL to the battles endpoint */
  private readonly battlesUrl: string;
  /** URL to the data endpoint */
  private readonly dataUrl: string;
  /** URL to the zetas endpoint */
  private readonly zetasUrl: string;
  /** URL to the squads endpoint */
  private readonly squadsUrl: string;
  /** URL to the roster endpoint */
  private readonly rosterUrl: string;

  /** token key is a SHA256 digest of the credentials used to access the API */
  private readonly tokenId: string;

  /** Creates a SWGoH.help API client. */
  public constructor(settings: Settings) {
    /** seal and save settings */
    this.settings = Object.seal(settings);

    /** Build swgoh.help API url */
    const protocol = this.settings.protocol || 'https';
    const host = this.settings.host || 'api.swgoh.help';
    const port = this.settings.port ? `:${this.settings.port}` : '';
    const url = `${protocol}://${host}${port}`;

    /** build endpoints */
    this.signinUrl = `${url}/auth/signin`;

    this.endpointUrl = (e: string) => `${url}/swgoh/${e}/`;
    this.dataUrl = `${url}/swgoh/data/`;
    this.playersUrl = `${url}/swgoh/players/`;
    this.guildsUrl = `${url}/swgoh/guilds/`;
    this.unitsUrl = `${url}/swgoh/units/`;
    this.eventsUrl = `${url}/swgoh/events/`;
    this.battlesUrl = `${url}/swgoh/battles/`;
    this.zetasUrl = `${url}/swgoh/zetas/`;
    this.squadsUrl = `${url}/swgoh/squads/`;
    this.rosterUrl = `${url}/swgoh/roster/`;

    // this.statsUrl = settings.statsUrl
    //   || 'https://crinolo-swgoh.glitch.me/baseStats/api/';
    // this.charStatsApi = settings.charStatsApi
    //   || 'https://crinolo-swgoh.glitch.me/statCalc/api/characters';
    // this.shipStatsApi = settings.shipStatsApi
    //   || 'https://crinolo-swgoh.glitch.me/statCalc/api/ships';

    /** compute unique hash from credentials */
    this.tokenId = String(
      Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        `${this.settings.username}${this.settings.password}`,
      ),
    );
  }

  /**
   * Attempts to log into the SWGoH.help API.
   * returns A SWGoH.help API session token
   */
  public login(): string {
    const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      contentType: 'application/x-www-form-urlencoded',
      method: 'post',
      payload: {
        client_id: this.settings.client_id || 'anything',
        client_secret: this.settings.client_secret || 'something',
        grant_type: 'password',
        password: this.settings.password,
        username: this.settings.username,
      },
      /** we'll handle errors ourselves */
      muteHttpExceptions: true,
    };
    const response = UrlFetchApp.fetch(this.signinUrl, params);

    if (response.getResponseCode() === 200) {
      const token: LoginResponse = JSON.parse(response.getContentText());
      /** save access token */
      this.setToken(token.access_token);
      // using getters and setters conflicts with online script debugger
      // this.token = token.access_token
    } else {
      throw new Error(`${RELEASE}: Login failed [HTTP status ${response.getResponseCode()}]`);
    }

    return this.getToken();
    // using getters and setters conflicts with online script debugger
    // return this.token
  }

  /** unspecified fetch */
  public fetch(endpoint: string, payload: any): any {
    return this.fetchAPI<any>(this.endpointUrl(endpoint), payload);
  }

  /** Fetch Player data */
  public fetchPlayer(payload: PlayerRequest): PlayerResponse[] {
    if (typeof payload.allycodes === 'number') {
      payload.allycodes = [payload.allycodes];
    }

    return this.fetchAPI<PlayerResponse[]>(this.playersUrl, payload);
  }

  /** Fetch Guild data */
  public fetchGuild(payload: GuildRequest): GuildResponse[] {
    return this.fetchAPI<GuildResponse[]>(this.guildsUrl, payload);
  }

  /** Fetch Units data */
  public fetchUnits(payload: UnitsRequest): UnitsResponse {
    if (typeof payload.allycodes === 'number') {
      payload.allycodes = [payload.allycodes];
    }

    return this.fetchAPI<UnitsResponse>(this.unitsUrl, payload);
  }

  /** Fetch Events data */
  public fetchEvents(payload: EventsRequest): EventsResponse {
    return this.fetchAPI<EventsResponse>(this.eventsUrl, payload);
  }

  /** Fetch Battles data */
  public fetchBattles(payload: BattlesRequest): BattlesResponse {
    return this.fetchAPI<BattlesResponse>(this.battlesUrl, payload);
  }

  /**
   * Fetch Data data
   * returns The structure of the response depends on the collection used.
   */
  public fetchData(payload: DataRequest): any {
    // TODO proper interface
    return this.fetchAPI<any>(this.dataUrl, payload);
  }

  /** Fetch Zetas data */
  public fetchZetas(payload: any): any {
    // TODO proper interface
    return this.fetchAPI<any>(this.zetasUrl, payload);
  }

  /** Fetch Squads data */
  public fetchSquads(payload: any): any {
    // TODO proper interface
    return this.fetchAPI<any>(this.squadsUrl, payload);
  }

  /** Fetch Roster data */
  public fetchRoster(payload: any): any {
    // TODO proper interface
    return this.fetchAPI<any>(this.rosterUrl, payload);
  }

  protected fetchAPI<T>(url: string, payload): T {

    let response: GoogleAppsScript.URL_Fetch.HTTPResponse;
    const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
        // using getters and setters conflicts with online script debugger
        // Authorization: `Bearer ${this.token}`
      },
      method: 'post',
      payload: JSON.stringify(payload),
      /** we'll handle errors ourselves */
      muteHttpExceptions: true,
    };

    try {
      response = UrlFetchApp.fetch(url, params);
      const code = response.getResponseCode();
      const headers = response.getHeaders();
      if (headers.hasOwnProperty('warning')) {
        const warnings: string[] = headers['warning']
          .split(',')
          .map((e: string) => e.trim());

        throw new Error(`${RELEASE}: SwgohHelp API issued warning(s) [${code}]
[${warnings.join('\n')}]`);
      }

      let json;
      try {
        json = JSON.parse(response.getContentText());
      } catch {
        throw new Error(`${RELEASE}: SwgohHelp API failed with parsing error [${code}]`);
      }

      if (code !== 200 || json.error) {
        throw new Error(`${RELEASE}: SwgohHelp API failed with error [${json.code} ${json.error}]
[${json.error_description}]`);
      }

      return json;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      throw new Error(`${RELEASE}: Unknown error`);
    }
  }

  // // using getters and setters conflicts with online script debugger
  // private get token() {
  //   const cache = CacheService.getScriptCache();
  //   const token = cache.get(this.tokenId) || this.login();
  //   return token;
  // }

  // using getters and setters conflicts with online script debugger
  // private set token(token: string) {
  //   const cache = CacheService.getScriptCache();
  //   cache.put(this.tokenId, token, 3600);
  // }

  /**
   * Retrieve the API session token from Google CacheService.
   * The key is a SHA256 digest of the credentials used to access the API.
   * Caching period is one hour.
   *
   * If there is no valid API session token, one is created by invoking the login() method.
   */
  private getToken(): string {
    const cache = CacheService.getScriptCache();
    const token = cache.get(this.tokenId) || this.login();

    return token;
  }

  /**
   * Store the API session token into Google CacheService.
   * The key is a SHA256 digest of the credentials used to access the API.
   * Caching period is one hour.
   */
  private setToken(token: string): void {
    const cache = CacheService.getScriptCache();
    const seconds = 3600;
    cache.put(this.tokenId, token, seconds);
  }
}

export default Client;

/** Interfaces and Types declarations */

/** Settings for creating a new Client */
export interface Settings {
  /** Registered username for swgoh.help API */
  readonly username: string;
  /** Registered password for swgoh.help API */
  readonly password: string;
  /** currently unused */
  readonly client_id?: string;
  /** currently unused */
  readonly client_secret?: string;
  /** default to 'https' */
  readonly protocol?: string;
  /** default to 'api.swgoh.help' */
  readonly host?: string;
  /** default to '' (80) */
  readonly port?: string;
}

/** Response from successful login */
type LoginResponse = {
  access_token: string;
  /** unmanaged */
  expires_in: string;
};

/** Supported languages for localized data */
export enum Languages {
  /** Chinese (Simplified) */
  chs_cn = 'chs_cn',
  /** Chinese (Traditional) */
  cht_cn = 'cht_cn',
  /** English (USA) */
  eng_us = 'eng_us',
  /** French (France) */
  fre_fr = 'fre_fr',
  /** German (Germany) */
  ger_de = 'ger_de',
  /** Indonesian (Indonesia) */
  ind_id = 'ind_id',
  /** Italian (italy) */
  ita_it = 'ita_it',
  /** Japanese (Japan) */
  jpn_jp = 'jpn_jp',
  /** Korean (South Korea) */
  kor_kr = 'kor_kr',
  /** Portugese (Brazil) */
  por_br = 'por_br',
  /** Russian (Russia) */
  rus_ru = 'rus_ru',
  /** Spanish? (???) */
  spa_xm = 'spa_xm',
  /** Thai (Thailand) */
  tha_th = 'tha_th',
  /** Turkish (Turkey) */
  tur_tr = 'tur_tr',
}

/** Sub-types from Responses */

/** Player stats */
type PlayerStats = {
  nameKey: string,
  value: number,
  /** can be used as key */
  index: number,
};

/** Bare Units properties */
type BaseUnit = {
  id: string,
  defId: string,
  // type: number,
};

/** Equipped properties for Roster units */
type Equipped = {
  equipmentId: string,
  slot: number,
};

/** Skills properties for Roster units */
type Skills = {
  id: string,
  tier: number,
  nameKey: string,
  isZeta: boolean,
};

/** Bare Mod properties */
type BaseMod = {
  id: string,
  set: number,
  level: number,
  pips: number,
  tier: number,
};

/** Mod properties */
interface Mod extends BaseMod {
  slot: number;
  primaryBonusType: number;
  primaryBonusValue: number;
  secondaryType_1: number;
  secondaryValue_1: number;
  secondaryRoll_1: number;
  secondaryType_2: number;
  secondaryValue_2: number;
  secondaryRoll_2: number;
  secondaryType_3: number;
  secondaryValue_3: number;
  secondaryRoll_3: number;
  secondaryType_4: number;
  secondaryValue_4: number;
  secondaryRoll_4: number;
}

/** Mod properties */
interface ModInstance extends BaseMod {
  stat: [number, (string | number), number][];
}

/** Crew properties */
type Crew = {
  unitId: string,
  slot: number,
  skillReferenceList: string[],
  cp: number,
  gp: number,
};

export enum COMBAT_TYPE {
  HERO = 1,
  SHIP = 2,
}

/** Roster properties */
interface Roster extends BaseUnit {
  nameKey: string;
  rarity: number;
  level: number;
  xp: number;
  gear: number;
  equipped: Equipped[];
  combatType: COMBAT_TYPE;
  skills: Skills[];
  mods: Mod[];
  crew: Crew[];
  gp: number;
}

/** Arena properties */
type Arena = {
  rank: number,
  squad: BaseUnit[],
};

/** Common properties for all Request interfaces */
type CommonRequest = {
  /**
   * Optional language to return translated names
   * If no language specified, no translations will be applied
   */
  language?: Languages;
  /** Optionally return enumerated items as their string equivalents */
  enums?: boolean;
};

/** Request interface for /swgoh/player endpoint */
export interface PlayerRequest extends CommonRequest {
  /** This field is mandatory */
  allycodes: number | number[];
  project?: PlayerOptions;
}

/** Optional projection of PlayerResponse properties (first layer) you want returned */
type PlayerOptions = {
  allyCode?: boolean;
  name?: boolean;
  level?: boolean;
  guildName?: boolean;
  gp?: boolean;
  gpChar?: boolean;
  gpShip?: boolean;
  updated?: boolean;
  stats?: boolean;
  roster?: any;  // boolean;
  arena?: boolean;
};

/** Response from PlayerRequest */
export interface PlayerResponse {
  allyCode?: number;
  name?: string;
  level?: number;
  guildname?: string;
  gp?: number;
  gpChar?: number;
  gpShip?: number;
  updated?: number;
  guildRefId?: string;
  stats?: PlayerStats[];
  roster?: Roster[];
  arena?: {
    char: Arena[],
    ship: Arena[],
  };
}

/** Optional projection of GuildResponse properties (first layer) you want returned */
type GuildOptions = {
  id?: boolean,
  name?: boolean;
  desc?: boolean;
  members?: boolean;
  status?: boolean;
  required?: boolean;
  bannerColor?: boolean;
  banerLogo?: boolean;
  message?: boolean;
  gp?: boolean;
  raid?: boolean;
  roster?: any;  // boolean;
  updated?: boolean;
};

/** Request interface for /swgoh/guild endpoint */
export interface GuildRequest extends CommonRequest {
  allycode: number;
  /** Optionally replace guild roster with full array of player profiles */
  roster?: boolean;
  /** (in conjunction with roster) Optionally replace guild roster with guild-wide units-report */
  units?: boolean;
  /** (in conjunction with units) Optionally include unit mods in units-report */
  mods?: boolean;
  project?: GuildOptions;
}

/** Response from GuildRequest */
export interface GuildResponse {
  updated?: number;
  id: string;
  roster?: PlayerResponse[] | UnitsResponse;
  name?: string;
  desc?: string;
  members?: number;
  status?: number;
  required?: number;
  bannerColor?: string;
  bannerLogo?: string;
  message?: string;
  gp?: number;
  raid?: {
    aat: string,
    rancor: string,
    sith_raid: string,
  };
}

/** Optional projection of UnitsdResponse properties (first layer) you want returned */
type UnitsOptions = {
  player?: boolean;
  allyCode?: boolean;
  starLevel?: boolean;
  level?: boolean;
  gearLevel?: boolean;
  gear?: boolean;
  zetas?: boolean;
  type?: boolean;
  mods?: boolean;
  gp?: boolean;
  updated?: boolean;
};

/** Request interface for /swgoh/units endpoint */
export interface UnitsRequest extends CommonRequest {
  allycodes: number | number[];
  /** Optionally include unit-mods in report */
  mods?: boolean;
  project?: UnitsOptions;
}

/** Response from UnitsRequest */
export interface UnitsResponse {
  [key: string]: UnitsInstance[];
}

/** Optional projection of EventsdResponse properties (first layer) you want returned */
type EventsOptions = {
  id?: boolean;
  priority?: boolean;
  nameKey?: boolean;
  summaryKey?: boolean;
  descKey?: boolean;
  instances?: boolean;
  squadType?: boolean;
  defensiveSquadType?: boolean;
};

/** Request interface for /swgoh/events endpoint */
export interface EventsRequest extends CommonRequest {
  project?: EventsOptions;
}

/** Response from EventsRequest */
export interface EventsResponse {
  updated: number;
  id?: string;
  priority?: number;
  nameKey?: string;
  summaryKey?: string;
  descKey?: string;
  instances?: EventsInstance[];
  squadType?: number;
  defensiveSquad?: number;
}

/** Optional projection of BattlesResponse properties (first layer) you want returned */
type BattlesOptions = {
  id?: boolean;
  nameKey?: boolean;
  descriptionKey?: boolean;
  campaignType?: boolean;
  campaignMapList?: boolean;
};

/** Request interface for /swgoh/battles endpoint */
export interface BattlesRequest extends CommonRequest {
  project?: BattlesOptions;
}

/** Response from BattlesRequest */
export interface BattlesResponse {
  updated: number;
  id?: string;
  nameKey?: string;
  descriptionKey?: string;
  campaignType?: number;
  campaignMapList?: CampaignMap[];
}

/** Supported collections with /swgoh/data endpoint */
export enum Collections {
  abilityList = 'abilityList',
  battleEnvironmentsList = 'battleEnvironmentsList',
  battleTargetingRuleList = 'battleTargetingRuleList',
  categoryList = 'categoryList',
  challengeList = 'challengeList',
  challengeStyleList = 'challengeStyleList',
  effectList = 'effectList',
  environmentCollectionList = 'environmentCollectionList',
  equipmentList = 'equipmentList',
  eventSamplingList = 'eventSamplingList',
  guildExchangeItemList = 'guildExchangeItemList',
  guildRaidList = 'guildRaidList',
  helpEntryList = 'helpEntryList',
  materialList = 'materialList',
  playerTitleList = 'playerTitleList',
  powerUpBundleList = 'powerUpBundleList',
  raidConfigList = 'raidConfigList',
  recipeList = 'recipeList',
  requirementList = 'requirementList',
  skillList = 'skillList',
  starterGuildList = 'starterGuildList',
  statModList = 'statModList',
  statModSetList = 'statModSetList',
  statProgressionList = 'statProgressionList',
  tableList = 'tableList',
  targetingSetList = 'targetingSetList',
  territoryBattleDefinitionList = 'territoryBattleDefinitionList',
  territoryWarDefinitionList = 'territoryWarDefinitionList',
  unitsList = 'unitsList',
  unlockAnnouncementDefinitionList = 'unlockAnnouncementDefinitionList',
  warDefinitionList = 'warDefinitionList',
  xpTableList = 'xpTableList',
}

/** Request interface for /swgoh/data endpoint */
export interface DataRequest extends CommonRequest {
  collection: Collections;
  match?: object;
  project?: object;
}

type AbilityListMatch = {};

type AbilityListOptions = {};

/** Request interface for /swgoh/data endpoint */
export interface AbilityListRequest extends DataRequest {
  match?: AbilityListMatch;
  project?: AbilityListOptions;
}

export interface AbilityListResponse {
  _id: string;
  id?: string;
  nameKey?: string;
  descKey?: string;
  prefabName?: string;
  triggerConditionList?: {
    conditionType: number,
    conditionValue: string,
  }[];
  stackingLineOverride?: string;
  tierList?: Tier[];
  cooldown?: number;
  icon?: string;
  applyTypeTooltipKey?: string;
  descriptiveTagList?: { tag: string }[];
  effectReferenceList?: EffectReference[];
  confirmationMessage?: {
    titleKey: string,
    descKey: string,
  };
  buttonLocation?: number;
  shortDescKey?: string;
  abilityType?: number;
  detailLocation?: number;
  allyTargetingRuleId?: string;
  useAsReinforcementDesc?: boolean;
  preferredAllyTargetingRuleId?: string;
  interactsWithTagList?: { tag: string }[];
  subIcon?: string;
  aiParams?: AiParams;
  cooldownType?: number;
  alwaysDisplayInBattleUi?: boolean;
  highlightWhenReadyInBattleUi?: boolean;
  hideCooldownDescription?: boolean;
}

/** Response from UnitsRequest */
type UnitsInstance = {
  updated?: number,
  player?: string,
  allyCode?: number,
  gp?: number,
  starLevel?: number,
  level?: number,
  gearLevel?: number,
  gear?: string[],
  zetas?: string[],
  type?: number,
  mods?: ModInstance[],
};

/** Event instance properties */
export type EventsInstance = {
  startTime: number,
  endTime: number,
  displayStartTime: number,
  displayEndTime: number,
  rewardTime: number,
};

type BaseItem = {
  id: string,
  type: number,
  weight: number,
  minQuantity: number,
  maxQuantity: number,
  rarity: number,
  statMod: undefined, // ???
};

type EnemyUnit = {
  baseEnemyItem: BaseItem,
  enemyLevel: number,
  enemyTier: number,
  threatLevel: number,
  thumbnailName: string,
  prefabName: string,
  displayedEnemy: boolean,
  unitClass: number,
};

type CampaignNodeMission = {
  id: string,
  nameKey: string,
  descKey: string,
  combatType: number,
  rewardPreviewList: BaseItem[], // ???
  shortNameKey: string,
  groupNameKey: string,
  firstCompleteRewardPreviewList: BaseItem[],
  enemyUnitPreviewList: EnemyUnit[],
};

type CampaignNode = {
  id: string,
  nameKey: string,
  campaignNodeMissionList: CampaignNodeMission[],
};

type CampaignNodeDifficultyGroup = {
  campaignNodeDifficulty: number,
  campaignNodeList: CampaignNode,
  unlockRequirementLocalizationKey: string,
};

/** CampaignMap properties */
type CampaignMap = {
  id: string,
  campaignNodeDifficultyGroupList: CampaignNodeDifficultyGroup[],
  entryOwnershipRequirementList: { id: string }[],
  unlockRequirementLocalizationKey: string,
};

export type EffectReference = {
  id: string,
  contextIndexList: number[], // ???
  maxBonusMove: number,
};

export type Tier = {
  descKey: string,
  upgradeDescKey: string,
  cooldownMaxOverride: number,
  effectReferenceList: EffectReference[],
  interactsWithTagList: { tag: string }[], // to be confirmed
};

export type AiParams = {
  preferredTargetAllyTargetingRuleId: string,
  preferredEnemyTargetingRuleId: string,
  requireEnemyPreferredTargets: boolean,
  requireAllyTargets: boolean,
};
