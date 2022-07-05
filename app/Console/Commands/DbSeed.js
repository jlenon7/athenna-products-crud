/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Command } from '@athenna/artisan'
import { Exec, File, Folder, Path } from '@secjs/utils'

export class DbSeed extends Command {
  /**
   * The name and signature of the console command.
   */
  signature = 'db:seed'

  /**
   * The console command description.
   */
  description = 'Seed the database with records.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
   */
  addFlags(commander) {
    return commander.option(
      '-c, --class <className>',
      'Set the only class that should be run.',
      null,
    )
  }

  /**
   * Execute the console command.
   *
   * @param {any} options
   * @return {Promise<void>}
   */
  async handle(options) {
    this.simpleLog('[ SEEDING DATABASE ]', 'rmNewLineStart', 'bold', 'green')

    if (options.class) {
      const file = await new File(
        Path.seeders(options.class.concat('.js')),
      ).load()

      return Exec.getModule(import(file.href)).then(Seed => {
        const seed = new Seed()

        this.success(`Running ({yellow} "${file.name}") seeder.`)

        return seed.run()
      })
    }

    const folder = await new Folder(Path.seeders()).load()
    const seeds = folder.getFilesByPattern('*.js')

    return seeds.map(file => {
      if (file.name === 'Seeder') {
        return null
      }

      return Exec.getModule(import(file.href)).then(Seed => {
        const seed = new Seed()

        this.success(`Running ({yellow} "${file.name}") seeder.`)

        return seed.run()
      })
    })
  }
}
