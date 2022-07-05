/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '@secjs/utils'
import { Command } from '@athenna/artisan'

export class DbMigrate extends Command {
  /**
   * The name and signature of the console command.
   */
  signature = 'db:migrate'

  /**
   * The console command description.
   */
  description = 'Migrate the database migrations.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
   */
  addFlags(commander) {
    return commander
      .option(
        '-t, --type <type>',
        'Set the type of migration. (Default is dev)',
        'dev',
      )
      .option(
        '-n, --name <name>',
        'Set the name of migration. (Default is init)',
        'init',
      )
      .option(
        '-s, --schema <schema>',
        'Set the path of the prisma schema. (Default is database/schema.prisma)',
        'database/schema.prisma',
      )
      .option(
        '--prismaArgs [prismaArgs]',
        'Set prisma arguments if needed.',
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
    this.simpleLog('[ MIGRATING DATABASE ]', 'rmNewLineStart', 'bold', 'green')

    const prismaCli = Path.bin('prisma')
    let command = `${prismaCli} migrate`

    command = command
      .concat(` ${options.type}`)
      .concat(` --name ${options.name}`)
      .concat(` --schema ${options.schema}`)

    if (options.prismaArgs) {
      command = command.concat(` ${options.prismaArgs}`)
    }

    try {
      await this.execCommand(
        command,
        `Running ${command.replace(prismaCli, 'prisma')}`,
      )

      this.success('Database successfully migrated.')
    } catch (error) {
      this.error(`Error while migrating database:`)
      console.log(await error.prettify())
    }
  }
}
