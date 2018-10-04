/**
 * SWGoH.help API client for Google Apps Script (GAS).
 * @preferred
 */

/**
 * SWGoH.help API client class.
 *
 * Available methods:
 * - client.fetchPlayer(payload: PlayerRequest): PlayerResponse
 * - client.fetchGuild(payload: GuildRequest): GuildResponse
 * - client.fetchUnits(payload: UnitsRequest): UnitsResponse
 * - client.fetchEvents(payload: EventsRequest): EventsResponse
 * - client.fetchBattles(payload: BattlesRequest): BattlesResponse
 * - client.fetchData(payload: DataRequest): DataResponse
 */
export class Client {
  private readonly settings: Settings;
  private readonly signinUrl: string;
  private readonly playerUrl: string;
  private readonly guildUrl: string;
  private readonly unitsUrl: string;
  private readonly eventsUrl: string;
  private readonly battlesUrl: string;
  private readonly dataUrl: string;

  private readonly tokenId: string;

  /**
   * Creates a SWGoH.help API client.
   */
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
    this.playerUrl = `${url}/swgoh/player/`;
    this.guildUrl = `${url}/swgoh/guild/`;
    this.unitsUrl = `${url}/swgoh/units/`;
    this.eventsUrl = `${url}/swgoh/events/`;
    this.battlesUrl = `${url}/swgoh/battles/`;
    this.dataUrl = `${url}/swgoh/data/`;

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
   * @returns A SWGoH.help API session token
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
      // unmanaged: token.expires_in
    } else {
      throw new Error(`Login failed with HTTP status [${response.getResponseCode()}]`);
    }

    return this.getToken();
    // using getters and setters conflicts with online script debugger
    // return this.token
  }

  /** Fetch Player data */
  public fetchPlayer(payload: PlayerRequest): PlayerResponse[] {
    if (typeof payload.allycodes === 'number') {
      payload.allycodes = [payload.allycodes];
    }

    return this.fetchAPI<PlayerResponse[]>(this.playerUrl, payload);
  }

  /** Fetch Guild data */
  public fetchGuild(payload: GuildRequest): GuildResponse {
    return this.fetchAPI<GuildResponse>(this.guildUrl, payload);
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

  /** Fetch Data data */
  public fetchData(payload: DataRequest): AbilityListResponse {
    // TODO proper interface
    return this.fetchAPI<AbilityListResponse>(this.dataUrl, payload);
  }

  protected fetchAPI<T>(url: string, payload): T {
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
    const response = UrlFetchApp.fetch(url, params);

    if (response.getResponseCode() === 200) {
      return JSON.parse(response.getContentText());
    }
    throw new Error(`Failed failed with HTTP status [${response.getResponseCode()}]`);
  }

  // using getters and setters conflicts with online script debugger
  // private get token() {
  //   const cache = CacheService.getScriptCache()
  //   const token = cache.get(this.tokenId) || this.login()
  //   return token
  // }

  // using getters and setters conflicts with online script debugger
  // private set token(token: string) {
  //   const cache = CacheService.getScriptCache()
  //   cache.put(this.tokenId, token, 3600)
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

/**
 * Interfaces and Types declarations
 */

/** Settings for creating a new Client */
export interface Settings {
  readonly username: string;
  readonly password: string;
  readonly client_id?: string;
  readonly client_secret?: string;
  readonly protocol?: string;
  readonly host?: string;
  readonly port?: string;
}

/** Response from successful login */
type LoginResponse = {
  access_token: string;
  expires_in: string;
};

/** Supported languages */
export enum Languages {
  chs_cn = 'chs_cn', cht_cn = 'cht_cn', eng_us = 'eng_us', fre_fr = 'fre_fr', ger_de = 'ger_de',
  ind_id = 'ind_id', ita_it = 'ita_it', jpn_jp = 'jpn_jp', kor_kr = 'kor_kr', por_br = 'por_br',
  rus_ru = 'rus_ru', spa_xm = 'spa_xm', tha_th = 'tha_th', tur_tr = 'tur_tr',
}

/** Sub-types from Responses */

/** Player stats */
type Stats = {
  nameKey: string,
  value: number,
  index: number,
};

/** Bare Units properties */
type BaseUnit = {
  id: string,
  defId: string,
  type: number,
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

/** Roster properties */
interface Roster extends BaseUnit {
  rarity: number;
  level: number;
  xp: number;
  gear: number;
  equipped: Equipped[];
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
   * */
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
  updated?: boolean;
  stats?: boolean;
  roster?: boolean;
  arena?: boolean;
};

/** Response from PlayerRequest */
export interface PlayerResponse {
  allycode?: number;
  name?: string;
  level?: number;
  guildname?: string;
  updated?: number;
  guildRefId?: string;
  stats?: Stats[];
  roster?: Roster[];
  arena?: {
    char: Arena[],
    ship: Arena[],
  };
}

/** Optional projection of GuildResponse properties (first layer) you want returned */
type GuildOptions = {
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
  roster?: boolean;
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
  roster?: PlayerResponse[];
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

// export type BattleEnvironmentsListResponse = {
//   _id: string,
//   prefab?: string,
//   audioPackageList?: any[],
// };

// export type BattleTargetingRuleList = {
//   _id: string,
// };

// export interface IDataResponse {}
