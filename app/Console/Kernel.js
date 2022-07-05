import { HttpCommandsLoader } from '@athenna/http'
import { ArtisanLoader, ConsoleKernel } from '@athenna/artisan'

export class Kernel extends ConsoleKernel {
  /**
   * Register the commands for the application.
   *
   * @return void
   */
  commands = [
    ...ArtisanLoader.loadCommands(),
    ...HttpCommandsLoader.loadCommands(),
    import('#app/Console/Commands/DbSeed'),
    import('#app/Console/Commands/DbWipe'),
    import('#app/Console/Commands/DbMigrate'),
    import('#app/Console/Commands/DbGenerate'),
  ]
}
