import { Facade } from '@athenna/ioc'
import { Model } from '#app/Models/Model'

export class ProductModelDefinition extends Model {
  /** @type {import('@prisma/client').Prisma.ProductDelegate} */
  #prismaModel

  constructor(database) {
    super()

    this.#prismaModel = database.product
  }

  query() {
    return this.#prismaModel
  }
}

/** @type {Facade & ProductModelDefinition} */
export const Product = Facade.createFor('Athenna/Database/ProductModel')
