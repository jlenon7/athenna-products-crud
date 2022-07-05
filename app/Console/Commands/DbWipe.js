/**
 * @athenna/artisan
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Command } from '@athenna/artisan'
import { PrismaClient } from '@prisma/client'

export class DbWipe extends Command {
  /**
   * The name and signature of the console command.
   */
  signature = 'db:wipe'

  /**
   * The console command description.
   */
  description = 'Drop all tables of database.'

  /**
   * Set additional flags in the commander instance.
   * This method is executed when registering your command.
   *
   * @param {import('commander').Command} commander
   * @return {import('commander').Command}
   */
  addFlags(commander) {
    return commander
  }

  /**
   * Execute the console command.
   *
   * @param {any} options
   * @return {Promise<void>}
   */
  async handle(options) {
    this.simpleLog('[ WIPING DATABASE ]', 'rmNewLineStart', 'bold', 'green')

    const prisma = new PrismaClient()

    await prisma.$connect()

    const tables = []

    Object.keys(prisma).forEach(key => {
      if (key.startsWith('$') || key.startsWith('_')) {
        return
      }

      tables.push(key)
    })

    await Promise.all(tables.map(table => prisma[table].deleteMany()))

    this.success('Database successfully wiped.')
  }
}
