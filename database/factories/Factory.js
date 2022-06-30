import { Assert } from '@japa/assert'

export class Factory {
  model

  #assert = new Assert()

  definition() {}

  async truncate() {
    await this.model.truncate()
  }

  async assertCount(number) {
    const count = await this.model.count()

    this.#assert.deepEqual(number, count)
  }

  async assertSoftDelete(values) {
    const model = await this.model.query().findFirst({ where: values })

    this.#assert.isDefined(model.deletedAt)
  }

  async assertExists(values) {
    const model = await this.model.query().findFirst({ where: values })

    this.#assert.isNotNull(model)
  }

  async assertNotExists(values) {
    const model = await this.model.query().findFirst({ where: values })

    this.#assert.isNull(model)
  }

  async assertExistsId(id) {
    const model = await this.model.findById(id)

    this.#assert.isNotNull(model)
  }

  async assertNotExistsId(id) {
    const model = await this.model.findById(id)

    this.#assert.isNull(model)
  }

  async makeOne(values) {
    const data = await this.definition()

    return {
      ...data,
      ...values,
    }
  }

  async makeMany(number, values) {
    const promises = []

    for (let i = 1; i <= number; i++) {
      promises.push(this.makeOne(values))
    }

    return Promise.all(promises)
  }

  async createOne(values) {
    const data = await this.makeOne(values)

    return this.model.createOne(data)
  }

  async createMany(number, values) {
    const promises = []

    for (let i = 1; i <= number; i++) {
      promises.push(this.createOne(values))
    }

    return Promise.all(promises)
  }
}
