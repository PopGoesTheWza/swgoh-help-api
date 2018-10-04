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
export declare class Client {
    private readonly settings;
    private readonly signinUrl;
    private readonly playerUrl;
    private readonly guildUrl;
    private readonly unitsUrl;
    private readonly eventsUrl;
    private readonly battlesUrl;
    private readonly dataUrl;
    private readonly tokenId;
    /**
     * Creates a SWGoH.help API client.
     */
    constructor(settings: Settings);
    /**
     * Attempts to log into the SWGoH.help API.
     * @returns A SWGoH.help API session token
     */
    login(): string;
    /** Fetch Player data */
    fetchPlayer(payload: PlayerRequest): PlayerResponse[];
    /** Fetch Guild data */
    fetchGuild(payload: GuildRequest): GuildResponse;
    /** Fetch Units data */
    fetchUnits(payload: UnitsRequest): UnitsResponse;
    /** Fetch Events data */
    fetchEvents(payload: EventsRequest): EventsResponse;
    /** Fetch Battles data */
    fetchBattles(payload: BattlesRequest): BattlesResponse;
    /** Fetch Data data */
    fetchData(payload: DataRequest): AbilityListResponse;
    protected fetchAPI<T>(url: string, payload: any): T;
    /**
     * Retrieve the API session token from Google CacheService.
     * The key is a SHA256 digest of the credentials used to access the API.
     * Caching period is one hour.
     *
     * If there is no valid API session token, one is created by invoking the login() method.
     */
    private getToken;
    /**
     * Store the API session token into Google CacheService.
     * The key is a SHA256 digest of the credentials used to access the API.
     * Caching period is one hour.
     */
    private setToken;
}
/**
 * Interfaces and Types declarations
 */
/** Settings for creating a new Client */
export declare type Settings = {
    readonly username: string;
    readonly password: string;
    readonly client_id?: string;
    readonly client_secret?: string;
    readonly protocol?: string;
    readonly host?: string;
    readonly port?: string;
};
/** Supported languages */
export declare enum Languages {
    chs_cn = "chs_cn",
    cht_cn = "cht_cn",
    eng_us = "eng_us",
    fre_fr = "fre_fr",
    ger_de = "ger_de",
    ind_id = "ind_id",
    ita_it = "ita_it",
    jpn_jp = "jpn_jp",
    kor_kr = "kor_kr",
    por_br = "por_br",
    rus_ru = "rus_ru",
    spa_xm = "spa_xm",
    tha_th = "tha_th",
    tur_tr = "tur_tr"
}
/** Sub-types from Responses */
/** Player stats */
declare type Stats = {
    nameKey: string;
    value: number;
    index: number;
};
/** Bare Units properties */
declare type BaseUnit = {
    id: string;
    defId: string;
    type: number;
};
/** Equipped properties for Roster units */
declare type Equipped = {
    equipmentId: string;
    slot: number;
};
/** Skills properties for Roster units */
declare type Skills = {
    id: string;
    tier: number;
    isZeta: boolean;
};
/** Bare Mod properties */
declare type BaseMod = {
    id: string;
    set: number;
    level: number;
    pips: number;
    tier: number;
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
declare type Crew = {
    unitId: string;
    slot: number;
    skillReferenceList: string[];
    cp: number;
    gp: number;
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
declare type Arena = {
    rank: number;
    squad: BaseUnit[];
};
/** Common properties for all Request interfaces */
declare type CommonRequest = {
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
declare type PlayerOptions = {
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
export declare type PlayerResponse = {
    allycode?: number;
    name?: string;
    level?: number;
    guildname?: string;
    updated?: number;
    guildRefId?: string;
    stats?: Stats[];
    roster?: Roster[];
    arena?: {
        char: Arena[];
        ship: Arena[];
    };
};
/** Optional projection of GuildResponse properties (first layer) you want returned */
declare type GuildOptions = {
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
/** Optional projection of UnitsdResponse properties (first layer) you want returned */
declare type UnitsOptions = {
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
/** Optional projection of EventsdResponse properties (first layer) you want returned */
declare type EventsOptions = {
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
/** Optional projection of BattlesResponse properties (first layer) you want returned */
declare type BattlesOptions = {
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
/** Supported collections with /swgoh/data endpoint */
export declare enum Collections {
    abilityList = "abilityList",
    battleEnvironmentsList = "battleEnvironmentsList",
    battleTargetingRuleList = "battleTargetingRuleList",
    categoryList = "categoryList",
    challengeList = "challengeList",
    challengeStyleList = "challengeStyleList",
    effectList = "effectList",
    environmentCollectionList = "environmentCollectionList",
    equipmentList = "equipmentList",
    eventSamplingList = "eventSamplingList",
    guildExchangeItemList = "guildExchangeItemList",
    guildRaidList = "guildRaidList",
    helpEntryList = "helpEntryList",
    materialList = "materialList",
    playerTitleList = "playerTitleList",
    powerUpBundleList = "powerUpBundleList",
    raidConfigList = "raidConfigList",
    recipeList = "recipeList",
    requirementList = "requirementList",
    skillList = "skillList",
    starterGuildList = "starterGuildList",
    statModList = "statModList",
    statModSetList = "statModSetList",
    statProgressionList = "statProgressionList",
    tableList = "tableList",
    targetingSetList = "targetingSetList",
    territoryBattleDefinitionList = "territoryBattleDefinitionList",
    territoryWarDefinitionList = "territoryWarDefinitionList",
    unitsList = "unitsList",
    unlockAnnouncementDefinitionList = "unlockAnnouncementDefinitionList",
    warDefinitionList = "warDefinitionList",
    xpTableList = "xpTableList"
}
/** Request interface for /swgoh/data endpoint */
export interface DataRequest extends CommonRequest {
    collection: Collections;
    match?: object;
    project?: object;
}
declare type AbilityListMatch = {};
declare type AbilityListOptions = {};
/** Request interface for /swgoh/data endpoint */
export interface AbilityListRequest extends DataRequest {
    match?: AbilityListMatch;
    project?: AbilityListOptions;
}
/** Response from GuildRequest */
export declare type GuildResponse = {
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
        aat: string;
        rancor: string;
        sith_raid: string;
    };
};
/** Response from UnitsRequest */
declare type UnitsInstance = {
    updated?: number;
    player?: string;
    allyCode?: number;
    gp?: number;
    starLevel?: number;
    level?: number;
    gearLevel?: number;
    gear?: string[];
    zetas?: string[];
    type?: number;
    mods?: ModInstance[];
};
/** Response from UnitsRequest */
export declare type UnitsResponse = {
    [key: string]: UnitsInstance[];
};
/** Event instance properties */
export declare type EventsInstance = {
    startTime: number;
    endTime: number;
    displayStartTime: number;
    displayEndTime: number;
    rewardTime: number;
};
/** Response from EventsRequest */
export declare type EventsResponse = {
    updated: number;
    id?: string;
    priority?: number;
    nameKey?: string;
    summaryKey?: string;
    descKey?: string;
    instances?: EventsInstance[];
    squadType?: number;
    defensiveSquad?: number;
};
declare type BaseItem = {
    id: string;
    type: number;
    weight: number;
    minQuantity: number;
    maxQuantity: number;
    rarity: number;
    statMod: undefined;
};
declare type EnemyUnit = {
    baseEnemyItem: BaseItem;
    enemyLevel: number;
    enemyTier: number;
    threatLevel: number;
    thumbnailName: string;
    prefabName: string;
    displayedEnemy: boolean;
    unitClass: number;
};
declare type CampaignNodeMission = {
    id: string;
    nameKey: string;
    descKey: string;
    combatType: number;
    rewardPreviewList: BaseItem[];
    shortNameKey: string;
    groupNameKey: string;
    firstCompleteRewardPreviewList: BaseItem[];
    enemyUnitPreviewList: EnemyUnit[];
};
declare type CampaignNode = {
    id: string;
    nameKey: string;
    campaignNodeMissionList: CampaignNodeMission[];
};
declare type CampaignNodeDifficultyGroup = {
    campaignNodeDifficulty: number;
    campaignNodeList: CampaignNode;
    unlockRequirementLocalizationKey: string;
};
/** CampaignMap properties */
export declare type CampaignMap = {
    id: string;
    campaignNodeDifficultyGroupList: CampaignNodeDifficultyGroup[];
    entryOwnershipRequirementList: {
        id: string;
    }[];
    unlockRequirementLocalizationKey: string;
};
/** Response from BattlesRequest */
export declare type BattlesResponse = {
    updated: number;
    id?: string;
    nameKey?: string;
    descriptionKey?: string;
    campaignType?: number;
    campaignMapList?: CampaignMap[];
};
export declare type EffectReference = {
    id: string;
    contextIndexList: number[];
    maxBonusMove: number;
};
export declare type Tier = {
    descKey: string;
    upgradeDescKey: string;
    cooldownMaxOverride: number;
    effectReferenceList: EffectReference[];
    interactsWithTagList: {
        tag: string;
    }[];
};
export declare type AiParams = {
    preferredTargetAllyTargetingRuleId: string;
    preferredEnemyTargetingRuleId: string;
    requireEnemyPreferredTargets: boolean;
    requireAllyTargets: boolean;
};
export declare type AbilityListResponse = {
    _id: string;
    id?: string;
    nameKey?: string;
    descKey?: string;
    prefabName?: string;
    triggerConditionList?: {
        conditionType: number;
        conditionValue: string;
    }[];
    stackingLineOverride?: string;
    tierList?: Tier[];
    cooldown?: number;
    icon?: string;
    applyTypeTooltipKey?: string;
    descriptiveTagList?: {
        tag: string;
    }[];
    effectReferenceList?: EffectReference[];
    confirmationMessage?: {
        titleKey: string;
        descKey: string;
    };
    buttonLocation?: number;
    shortDescKey?: string;
    abilityType?: number;
    detailLocation?: number;
    allyTargetingRuleId?: string;
    useAsReinforcementDesc?: boolean;
    preferredAllyTargetingRuleId?: string;
    interactsWithTagList?: {
        tag: string;
    }[];
    subIcon?: string;
    aiParams?: AiParams;
    cooldownType?: number;
    alwaysDisplayInBattleUi?: boolean;
    highlightWhenReadyInBattleUi?: boolean;
    hideCooldownDescription?: boolean;
};
export declare type BattleEnvironmentsListResponse = {
    _id: string;
    prefab?: string;
    audioPackageList?: any[];
};
export declare type BattleTargetingRuleList = {
    _id: string;
};
export interface ActiveEffectTagCriteriaList {
    tag: string;
    exclude: string;
}
export interface RootObject {
    unitSelect: number;
    battleSide: number;
    unitClassList: number[];
    forceAlignmentList: any[];
    category?: any;
    healthState: number;
    statValueList: any[];
    activeEffectTagCriteriaList: ActiveEffectTagCriteriaList[];
    battleDeploymentState: number;
    id: string;
    excludeSelf?: boolean;
    excludeSelectedTarget?: boolean;
}
export {};
