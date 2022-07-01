import { Assert } from '@japa/assert'
import { faker } from '@faker-js/faker'

export class Factory {
  faker = faker
  assert = new Assert()

  /**
   * Define the model's for factory.
   *
   * @return {any}
   */
  get model() {
    return {}
  }

  /**
   * Define the model's default state.
   *
   * @return {any}
   */
  definition() {}

  /**
   * Make one model instance.
   *
   * @param {any} [values]
   * @returns {Promise<any>}
   */
  async makeOne(values = {}) {
    const data = await this.definition()

    return {
      ...data,
      ...values,
    }
  }

  /**
   * Make many model instances.
   *
   * @param {number} number
   * @param {any} [values]
   * @returns {Promise<any[]>}
   */
  async makeMany(number, values) {
    const promises = []

    for (let i = 1; i <= number; i++) {
      promises.push(this.makeOne(values))
    }

    return Promise.all(promises)
  }

  /**
   * Create one model instance in database.
   *
   * @param {any} [values]
   * @returns {Promise<any>}
   */
  async createOne(values) {
    const data = await this.makeOne(values)

    return this.model.create(data, true)
  }

  /**
   * Create many model instances in database.
   *
   * @param {number} number
   * @param {any} [values]
   * @returns {Promise<any[]>}
   */
  async createMany(number, values) {
    const promises = []

    for (let i = 1; i <= number; i++) {
      promises.push(this.createOne(values))
    }

    return Promise.all(promises)
  }

  /**
   * Delete all data of the respective factory.
   *
   * @return {Promise<void>}
   */
  async truncate() {
    await this.model.query().deleteMany()
  }

  async assertSoftDelete(values) {
    const model = await this.model.query().findFirst({ where: values })

    this.assert.isDefined(model[this.model.DELETED_AT])
  }

  /**
   * Assert that the number of respective model is the number.
   *
   * @param {number} number
   * @return {Promise<void>}
   */
  async assertCount(number) {
    const count = await this.model.count()

    this.assert.deepEqual(number, count)
  }

  /**
   * Assert that the values matches any model in database.
   *
   * @param {any} values
   * @return {Promise<void>}
   */
  async assertExists(values) {
    const model = await this.model.query().findFirst({ where: values })

    this.assert.isNotNull(model)
  }

  /**
   * Assert that the values does not match any model in database.
   *
   * @param {any} values
   * @return {Promise<void>}
   */
  async assertNotExists(values) {
    const model = await this.model.query().findFirst({ where: values })

    this.assert.isNull(model)
  }
}
