/**
 * Returns a SwgohHelp API client.
 *
 * Available methods:
 *
 * client.fetchPlayer(payload)
 * client.fetchGuild(payload)
 * client.fetchUnits(payload)
 * client.fetchEvents(payload)
 * client.fetchBattles(payload)
 * client.fetchData(payload)
 *
 * @param {settings object} settings        A well-formed domain name to resolve.
 * @return {SwgohHelp client}               A SwgohHelp API client.
 * @customfunction
 */

class SwgohHelpApiClient {

  private readonly settings: Settings
  private readonly signin_url: string
  private readonly player_url: string
  private readonly guild_url: string
  private readonly units_url: string
  private readonly events_url: string
  private readonly battles_url: string
  private readonly data_url: string

  private readonly tokenId: string

  private getToken() {
    const cache = CacheService.getScriptCache()
    const token = cache.get(this.tokenId) || this.login()
    return token
  }

  private setToken(token: string) {
    const cache = CacheService.getScriptCache()
    cache.put(this.tokenId, token, 3600)
  }

  public constructor(settings: Settings) {
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

  public login() {
    const params = {
      contentType: 'application/x-www-form-urlencoded',
      method: 'post',
      payload: {
        username: this.settings.username,
        password: this.settings.password,
        grant_type: "password",
        client_id: this.settings.client_id || "anything",
        client_secret: this.settings.client_secret || "something"
      },
      muteHttpExceptions: true,
    }
    const response = UrlFetchApp.fetch(this.signin_url, {
      contentType: 'application/x-www-form-urlencoded',
      method: 'post',
      payload: {
        username: this.settings.username,
        password: this.settings.password,
        grant_type: "password",
        client_id: this.settings.client_id || "anything",
        client_secret: this.settings.client_secret || "something"
      },
      muteHttpExceptions: true,
    })
    
    // const debug_response = {
    //   getResponseCode: response.getResponseCode(),
    //   getContentText: response.getContentText().split("\n")
    // }
    if (response.getResponseCode() === 200 ) {
      const token = JSON.parse(response.getContentText())
      this.setToken(token.access_token)  // token.expires_in
    } else {
      throw new Error('! Cannot login with these credentials')
    }
    
    return this.getToken()
  }

  protected fetchAPI(url: string, payload) {
    // const debug_params = {
    //   contentType: 'application/json',
    //   headers: {
    //     Authorization: `Bearer ${this.getToken()}`
    //   },
    //   method: 'post',
    //   payload: JSON.stringify(payload),
    //   muteHttpExceptions: true
    // }
    const response = UrlFetchApp.fetch(url, {
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      },
      method: 'post',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    })
    // const debug_response = {
    //   getResponseCode: response.getResponseCode(),
    //   getContentText: response.getContentText().split("\n")
    // }
    // debugger

    if (response.getResponseCode() === 200 ) {
      return JSON.parse(response.getContentText())
    } else {
      throw new Error('! API returned an error')
    }
  }

  public fetchPlayer(payload: PlayerPayload) {
    const allycodes = payload.allycodes
    if (!(allycodes instanceof Array)) {
      payload.allycodes = [payload.allycodes] as number[]
    }
    payload.allycodes = payload.allycodes.map( e => {
      if (typeof e === 'string') {
        const m = e.match(/(\d{3})[^\d]*(\d{3})[^\d]*(\d{3})/)
        e = m && Number(`${m[1]}${m[2]}${m[3]}`)
      } else if (typeof e !== 'number') {
        e = Number(e)
      }
      return e
    } ).filter( e => typeof e === 'number' && e > 99999999)

    return this.fetchAPI( this.player_url, payload )
  }

  public fetchGuild(payload: GuildPayload) {
    return this.fetchAPI( this.guild_url, payload )
  }

  public fetchUnits(payload: UnitsPayload) {
    return this.fetchAPI( this.units_url, payload )
  }

  public fetchEvents(payload: EventsPayload) {
    return this.fetchAPI( this.events_url, payload )
  }

  public fetchBattles(payload: BattlesPayload) {
    return this.fetchAPI( this.battles_url, payload )
  }

  public fetchData(payload: DataPayload) {
    return this.fetchAPI( this.data_url, payload );
  }
}

export { SwgohHelpApiClient }
