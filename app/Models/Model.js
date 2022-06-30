import { Exec } from '@secjs/utils'
import { NotFoundException } from '#app/Exceptions/NotFoundException'

export class Model {
  query() {}

  async count(filters = {}) {
    return this.query().count(filters)
  }

  async truncate() {
    await this.query().deleteMany()
  }

  async createOne(data) {
    return this.query().create({ data })
  }

  async findAll(pagination, filters = {}) {
    if (!pagination) {
      return this.query().findMany()
    }

    const total = await this.count(filters)

    const models = await this.query().findMany({
      skip: pagination.page,
      take: pagination.limit,
      ...filters,
    })

    return Exec.pagination(models, total, pagination)
  }

  async findById(id, filters = {}) {
    return this.query().findFirst({ where: { id }, ...filters })
  }

  async safeFindById(id, filters = {}) {
    const model = await this.query().findFirst({ where: { id }, ...filters })

    if (!model) {
      throw new NotFoundException('Model not found')
    }

    return model
  }

  async updateOne(id, data) {
    const model = await this.findById(id)

    return this.query().update({
      data,
      where: {
        id: model.id,
      },
    })
  }

  async deleteOne(id, force = false) {
    const model = await this.findById(id)

    if (force) {
      await this.query().delete({ where: { id: model.id } })

      return
    }

    return this.query().update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: model.id,
      },
    })
  }
}
