/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { File, Path } from '@secjs/utils'
import { Command } from '@athenna/artisan'

export class DbGenerate extends Command {
  /**
   * The name and signature of the console command.
   */
  signature = 'db:generate'

  /**
   * The console command description.
   */
  description = 'Generate the prisma models.'

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
    this.simpleLog(
      '[ GENERATING PRISMA MODELS ]',
      'rmNewLineStart',
      'bold',
      'green',
    )

    const prismaCli = Path.bin('prisma')
    let command = `${prismaCli} generate`

    // prisma generate --schema database/schema.prisma && node artisan prisma:fix

    command = command.concat(` --schema ${options.schema}`)

    if (options.prismaArgs) {
      command = command.concat(` ${options.prismaArgs}`)
    }

    try {
      await this.execCommand(
        command,
        `Running ${command.replace(prismaCli, 'prisma')}`,
      )

      this.success('Models successfully generated.')

      const prismaTypeFile = await new File(
        Path.nodeModules('.prisma/client/index.d.ts'),
      ).load()

      await File.safeRemove(Path.nodeModules('@prisma/client/index.d.ts'))
      await prismaTypeFile.copy(Path.nodeModules('@prisma/client/index.d.ts'))

      this.success('Prisma types successfully fixed!')
    } catch (error) {
      this.error(`Error while generating models:`)
      console.log(await error.prettify())
    }
  }
}
