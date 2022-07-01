import { Facade } from '@athenna/ioc'
import { Product } from '#app/Models/Product'
import { Factory } from '#database/factories/Factory'

export class ProductFactoryDefinition extends Factory {
  /**
   * Define the model's for factory.
   *
   * @return {any}
   */
  get model() {
    return Product
  }

  /**
   * Define the model's default state.
   *
   * @return {any}
   */
  definition() {
    return {
      title: this.faker.commerce.product(),
      description: this.faker.commerce.productDescription(),
    }
  }
}

/** @type {Facade & ProductFactoryDefinition} */
export const ProductFactory = Facade.createFor(
  'Athenna/Database/ProductFactory',
)
