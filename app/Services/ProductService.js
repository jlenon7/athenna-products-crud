import { Product } from '#app/Models/Product'
import { NotFoundException } from '#app/Exceptions/NotFoundException'
import { Exec } from '@secjs/utils'

export class ProductService {
  async findAll(pagination) {
    const total = await Product.count()

    const products = await Product.findMany({
      skip: pagination.page,
      take: pagination.limit,
    })

    return Exec.pagination(products, total, pagination)
  }

  async createOne(data) {
    return Product.create({ data })
  }

  async findOne(id) {
    const product = await Product.findFirst({ where: { id: parseInt(id) } })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }

  async updateOne(id, data) {
    const product = await this.findOne(id)

    return Product.update({
      data,
      where: {
        id: product.id,
      },
    })
  }

  async deleteOne(id, force = false) {
    const product = await this.findOne(id)

    if (force) {
      await Product.delete({ where: { id: product.id } })

      return
    }

    return Product.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: product.id,
      },
    })
  }
}
