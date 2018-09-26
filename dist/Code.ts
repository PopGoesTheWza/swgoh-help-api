/**
 * SWGoH.help API client module.
 * @preferred
 */

/**
 * API client class.
 *
 * Available methods:
 * - client.fetchPlayer(payload)
 * - client.fetchGuild(payload)
 * - client.fetchUnits(payload)
 * - client.fetchEvents(payload)
 * - client.fetchBattles(payload)
 * - client.fetchData(payload)
 */
export class SwgohHelpApiClient {

  private readonly settings: SwgohHelpApiSettings
  private readonly signin_url: string
  private readonly player_url: string
  private readonly guild_url: string
  private readonly units_url: string
  private readonly events_url: string
  private readonly battles_url: string
  private readonly data_url: string

  private readonly tokenId: string

  // private get token() {
  //   const cache = CacheService.getScriptCache()
  //   const token = cache.get(this.tokenId) || this.login()
  //   return token
  // }
  
  // private set token(token: string) {
  //   const cache = CacheService.getScriptCache()
  //   cache.put(this.tokenId, token, 3600)
  // }
  
  /**
   * Retrieve the API session token from Google CacheService.
   * The key is a SHA256 digest of the username and password used to access the API.
   * Caching period is one hour.
   * If there is no API session token, one is created by invoking the login() method.
   */
  private getToken() {
    const cache = CacheService.getScriptCache()
    const token: string = cache.get(this.tokenId) || this.login()
    return token
  }

  /**
   * Store the API session token into Google CacheService.
   * The key is a SHA256 digest of the username and password used to access the API.
   * Caching period is one hour.
   */
  private setToken(token: string) {
    const cache = CacheService.getScriptCache()
    cache.put(this.tokenId, token, 3600)
  }

  /**
   * Creates a SWGoH.help API client.
   */
  public constructor(settings: SwgohHelpApiSettings) {
    const protocol = settings.protocol || "https"
    const host = settings.host || "api.swgoh.help"
    const port = settings.port ? `:${settings.port}` : ''
  
    const url = `${protocol}://${host}${port}`
  
    this.signin_url = `${url}/auth/signin`
    this.player_url = `${url}/swgoh/player/`
    this.guild_url = `${url}/swgoh/guild/`
    this.units_url = `${url}/swgoh/units/`
    this.events_url = `${url}/swgoh/events/`
    this.battles_url = `${url}/swgoh/battles/`
    this.data_url = `${url}/swgoh/data/`
  
    this.settings = settings

    this.tokenId = String(Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      `${settings.username}${settings.password}`
    ))
  }

  /**
   * Attempts to log into the SWGoH.help API.
   * @returns A SWGoH.help API session token
   */
  public login() {
    const params = {
      contentType: 'application/x-www-form-urlencoded',
      method: 'post' as "post",  // Silly workaround
      payload: {
        username: this.settings.username,
        password: this.settings.password,
        grant_type: "password",
        client_id: this.settings.client_id || "anything",
        client_secret: this.settings.client_secret || "something"
      },
      muteHttpExceptions: true,
    }
    const response = UrlFetchApp.fetch(this.signin_url, params)
    
    if (response.getResponseCode() === 200 ) {
      const token = JSON.parse(response.getContentText())
      // this.token = token.access_token
      this.setToken(token.access_token)
      // Unmanaged: token.expires_in
    } else {
      throw new Error('! Cannot login with these credentials')
    }
    
    // return this.token
    return this.getToken()
  }

  protected fetchAPI(url: string, payload) {
    const params = {
      contentType: 'application/json',
      headers: {
        // Authorization: `Bearer ${this.token}`
        Authorization: `Bearer ${this.getToken()}`
      },
      method: 'post' as "post",  // Silly workaround
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
    const response = UrlFetchApp.fetch(url, params)

    if (response.getResponseCode() === 200 ) {
      return JSON.parse(response.getContentText())
    } else {
      throw new Error('! API returned an error')
    }
  }

  /**
   * Fetch Player data
   */
  public fetchPlayer(payload: PlayerPayload) {
    // TODO: is this type checking/fixing really necessary?
    const acs = payload.allycodes
    if ( !(acs instanceof Array) ) { payload.allycodes = [acs] as number[] }
    payload.allycodes = (payload.allycodes as any[] ).map( e => {
      if (typeof e === 'string') {
        const m = e.match(/(\d{3})[^\d]*(\d{3})[^\d]*(\d{3})/)
        e = m && Number(`${m[1]}${m[2]}${m[3]}`)
      } else if (typeof e !== 'number') {
        e = Number(e)
      }
      return e
    } ).filter( e => typeof e === 'number' && e > 99999999)

    return this.fetchAPI( this.player_url, payload ) as PlayerObject[]
  }

  /**
   * Fetch Guild data
   */
  public fetchGuild(payload: GuildPayload) {
    return this.fetchAPI( this.guild_url, payload ) as GuildObject
  }

  /**
   * Fetch Units data
   */
  public fetchUnits(payload: UnitsPayload) {
    return this.fetchAPI( this.units_url, payload )
  }

  /**
   * Fetch Events data
   */
  public fetchEvents(payload: EventsPayload) {
    return this.fetchAPI( this.events_url, payload )
  }

  /**
   * Fetch Battles data
   */
  public fetchBattles(payload: BattlesPayload) {
    return this.fetchAPI( this.battles_url, payload )
  }

  /**
   * Fetch Data data
   */
  public fetchData(payload: DataPayload) {
    return this.fetchAPI( this.data_url, payload );
  }
}
