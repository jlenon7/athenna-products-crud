import { Product } from '#app/Models/Product'

export class ProductController {
  /**
   * Index method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async index({ response, data }) {
    const { page, limit, resourceUrl } = data.pagination

    const body = await Product.paginate(page, limit, resourceUrl)

    return response.status(200).send(body)
  }

  /**
   * Store method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async store({ request, response }) {
    const body = await Product.create(request.body)

    return response.status(201).send(body)
  }

  /**
   * Show method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async show({ response, params }) {
    const body = await Product.findByIdOrFail(params.id)

    return response.status(200).send(body)
  }

  /**
   * Update method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async update({ request, response, params }) {
    const body = await Product.updateById(params.id, request.body)

    return response.status(200).send(body)
  }

  /**
   * Delete method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async delete({ response, params, queries }) {
    await Product.deleteById(params.id, queries.force)

    return response.status(204)
  }
}
