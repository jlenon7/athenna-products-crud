import { Product } from '#app/Models/Product'

export class ProductController {
  /**
   * Index method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async index({ response, data }) {
    const body = await Product.findAll(data.pagination)

    return response.status(200).send(body)
  }

  /**
   * Store method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async store({ request, response }) {
    const body = await Product.createOne(request.body)

    return response.status(201).send(body)
  }

  /**
   * Show method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async show({ response, params }) {
    const body = await Product.safeFindById(parseInt(params.id))

    return response.status(200).send(body)
  }

  /**
   * Update method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async update({ request, response, params }) {
    const body = await Product.updateOne(parseInt(params.id), request.body)

    return response.status(200).send(body)
  }

  /**
   * Delete method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async delete({ response, params, queries }) {
    await Product.deleteOne(parseInt(params.id), queries.force)

    return response.status(204)
  }
}
