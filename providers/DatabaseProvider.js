import { Log } from '@athenna/logger'
import { PrismaClient } from '@prisma/client'
import { ServiceProvider } from '@athenna/ioc'
import { ProductModelDefinition } from '#app/Models/Product'
import { ProductFactoryDefinition } from '#database/factories/ProductFactory'

export class DatabaseProvider extends ServiceProvider {
  /**
   * Register any application service provider.
   */
  register() {}

  /**
   * Bootstrap any application service provider.
   */
  async boot() {
    const prisma = new PrismaClient()

    prisma
      .$connect()
      .then(() => {
        if (Env('BOOT_LOGS') !== 'false') {
          Log.success('Database successfully connected')
        }

        this.container.instance('Athenna/Database', prisma)
        this.container.singleton(
          'Athenna/Database/ProductModel',
          ProductModelDefinition,
          false,
        )
        this.container.singleton(
          'Athenna/Database/ProductFactory',
          ProductFactoryDefinition,
          false,
        )
      })
      .catch(reason => Log.error(reason))
  }
}
