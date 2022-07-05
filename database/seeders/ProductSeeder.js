import { Seeder } from '#database/seeders/Seeder'
import { ProductFactory } from '#database/factories/ProductFactory'

export class ProductSeeder extends Seeder {
  /**
   * Run the database seeders.
   *
   * @return {Promise<void>}
   */
  async run() {
    await ProductFactory.createMany(10)
  }
}
