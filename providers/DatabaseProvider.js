import { PrismaClient } from '@prisma/client'
import { ServiceProvider } from '@athenna/ioc'

export class DatabaseProvider extends ServiceProvider {
  /**
   * Register any application service provider.
   */
  register() {
    const prisma = new PrismaClient()

    this.container.instance('Athenna/Core/Database', prisma)
  }

  /**
   * Bootstrap any application service provider.
   */
  boot() {}
}
