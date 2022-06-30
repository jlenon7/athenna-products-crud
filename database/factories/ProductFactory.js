import { Facade } from '@athenna/ioc'
import { faker } from '@faker-js/faker'
import { Factory } from '#database/factories/Factory'

export class ProductFactoryDefinition extends Factory {
  constructor(productModel) {
    super()

    this.model = productModel
  }

  definition() {
    return {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
    }
  }
}

/** @type {Facade & ProductFactoryDefinition} */
export const ProductFactory = Facade.createFor(
  'Athenna/Database/ProductFactory',
)
