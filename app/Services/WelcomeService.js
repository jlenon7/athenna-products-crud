export class WelcomeService {
  /**
   * Use the constructor to resolve any dependency of the Ioc container.
   */
  constructor() {}

  async findOne() {
    return {
      name: Config.get('app.name', '@athenna/scaffold'),
      domain: Config.get('http.domain', ''),
      version: Config.get('app.version', '1.0.0'),
      source: Config.get('app.source', 'https://github.com/AthennaIO'),
      description: Config.get(
        'app.description',
        "The Athenna scaffold project used by 'athenna new project' command to create your project.",
      ),
    }
  }
}
