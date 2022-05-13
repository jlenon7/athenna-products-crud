export class ProductController {
  /** @type {import('#app/Services/ProductService').ProductService} */
  #productService

  /**
   * Resolve any dependency of the service container
   * inside the constructor.
   */
  constructor(productService) {
    this.#productService = productService
  }

  /**
   * Index method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async index({ response, data }) {
    const body = await this.#productService.findAll(data.pagination)

    return response.status(200).send(body)
  }

  /**
   * Store method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async store({ request, response }) {
    const body = await this.#productService.createOne(request.body)

    return response.status(201).send(body)
  }

  /**
   * Show method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async show({ response, params }) {
    const body = await this.#productService.findOne(params.id)

    return response.status(200).send(body)
  }

  /**
   * Update method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async update({ request, response, params }) {
    const body = await this.#productService.updateOne(params.id, request.body)

    return response.status(200).send(body)
  }

  /**
   * Delete method
   *
   * @param {import('@athenna/http').ContextContract} ctx
   */
  async delete({ response, params, queries }) {
    await this.#productService.deleteOne(params.id, queries.force)

    return response.status(204)
  }
}
