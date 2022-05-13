export class PaginationMiddleware {
  /**
   * Resolve any dependency of the service container
   * inside the constructor.
   */
  constructor() {}

  /**
   * Handle method is executed before the request gets
   * in your controller.
   *
   * @param {import('@athenna/http').HandleContextContract} ctx
   */
  async handle({ request, data, next }) {
    const pagination = {
      page: request.query('page', '0'),
      limit: request.query('limit', '10'),
      resourceUrl: request.baseUrl,
    }

    pagination.page = parseInt(pagination.page)
    pagination.limit = parseInt(pagination.limit)

    data.pagination = pagination

    next()
  }
}
