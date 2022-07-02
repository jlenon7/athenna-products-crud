import { Facade } from '@athenna/ioc'
import { Model } from '#app/Models/Model'
import { Database } from '#providers/Facades/Database'

export class ProductModelDefinition extends Model {
  /**
   * The primary key associated with the table.
   *
   *  @return {string}
   */
  get primaryKey() {
    return 'id'
  }

  /**
   * The attributes that could be persisted in database.
   *
   *  @return {string[]}
   */
  get persistOnly() {
    return ['title', 'description']
  }

  /**
   * Return a boolean specifying if Model will use soft delete.
   *
   *  @return {boolean}
   */
  get isSoftDelete() {
    return true
  }

  /**
   * The main prisma model to make more specific queries.
   *
   * @return {import('@prisma/client').Prisma.ProductDelegate}
   */
  query() {
    return Database.product
  }
}

/** @type {Facade & ProductModelDefinition} */
export const Product = Facade.createFor('Athenna/Database/ProductModel')
