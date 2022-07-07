export class WelcomeService {
  /**
   * Use the constructor to resolve any dependency of the Ioc container.
   */
  constructor() {}

  async findOne() {
    return {
      name: Config.get('app.name'),
      domain: Config.get('http.domain'),
      version: Config.get('app.version'),
      source: Config.get('app.source'),
      description: Config.get('app.description'),
    }
  }
}
