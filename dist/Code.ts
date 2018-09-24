"use strict";

interface Settings {
  readonly username: string;
  readonly password: string;
  readonly client_id?: string;
  readonly client_secret?: string;
  readonly protocol?: string;
  readonly host?: string;
  readonly port?: string;
}

/**
 * Returns a SwgohHelp API client.
 *
 * Available methods:
 *
 * client.fetchPlayer(allycodes)
 * client.fetchGuild(allycode)
 * client.fetchUnits(criteria)
 * client.fetchZetas(criteria)
 * client.fetchData(criteria)
 *
 * @param {settings object} settings        A well-formed domain name to resolve.
 * @return {SwgohHelp client}               A SwgohHelp API client.
 * @customfunction
 */

// Classes
class getClient {

  private readonly settings: Settings
  private readonly signin_url: string
  private readonly player_url: string
  private readonly guild_url: string
  private readonly units_url: string
  private readonly zetas_url: string
  private readonly data_url: string

  get token() {
    const cache = CacheService.getDocumentCache()
    const token = cache.get('swgoh-help-api-token') || this.login()
    return token
  }

  set token(token: string) {
    const cache = CacheService.getDocumentCache()
    cache.put('swgoh-help-api-token', token, 3600)
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
    this.zetas_url = `${url}/swgoh/zetas/`
    this.data_url = `${url}/swgoh/data/`
  
    this.settings = settings

    }

    public login() {

    const response = UrlFetchApp.fetch(this.signin_url, {
      'method': 'post',
      'payload': {
        'username': this.settings.username,
        'password': this.settings.password,
        'grant_type': "password",
        'client_id': this.settings.client_id,
        'client_secret': this.settings.client_secret
      },
      'muteHttpExceptions': true,
    })

    if (response.getResponseCode() === 200 ) {
      const token = JSON.parse(response.getContentText())
      this.token = token.access_token
    } else {
      throw new Error('! Cannot login with these credentials')
    }

    return this.token
  }

  protected fetchAPI(url: string, criteria: string = '/', lang: string = '') {

    const response = UrlFetchApp.fetch(`${url}${criteria}/${lang}`, {
      'method': 'post',
      'payload': { 'access_token': this.token },
      'muteHttpExceptions': true
    })

    if (response.getResponseCode() === 200 ) {
      return JSON.parse(response.getContentText())
    } else {
      throw new Error('! API returned an error')
    }

  }

  public fetchPlayer(allycode: string) {
    return this.fetchAPI( this.player_url, allycode )
  }

  public fetchGuild(allycode: string) {
    return this.fetchAPI( this.guild_url, allycode )
  }

  public fetchUnits(allycode: string): any {
    return this.fetchAPI( this.units_url, allycode )
  }

  public fetchZetas(allycode: string): any {
    return this.fetchAPI( this.zetas_url, allycode )
  }

  public fetchData(criteria: string): any {
    return this.fetchAPI( this.data_url, criteria );
  }
}
