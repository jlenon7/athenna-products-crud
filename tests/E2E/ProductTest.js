import { Test } from '@athenna/test'
import { ProductFactory } from '#database/factories/ProductFactory'

export class ProductTest extends Test {
  /** @type {import('@prisma/client').Product} */
  _macbookPdt

  async beforeEach() {
    this._macbookPdt = await ProductFactory.createOne()

    await ProductFactory.createMany(10)
  }

  async afterEach() {
    await ProductFactory.truncate()
  }

  /**
   * Run your test.
   *
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToListAllProductsPaginated({ request }) {
    await ProductFactory.createMany(5, { deletedAt: new Date() })

    const response = await request.get('/api/products?limit=4')

    response.assertStatusCode(200)
    response.assertBodyContains({
      data: [{ id: this._macbookPdt.id }],
      meta: {
        itemCount: 4,
        totalItems: 11,
        totalPages: 3,
        currentPage: 0,
        itemsPerPage: 4,
      },
      links: {
        first: '/api/products?limit=4',
        previous: '/api/products?page=0&limit=4',
        next: '/api/products?page=1&limit=4',
        last: '/api/products?page=3&limit=4',
      },
    })
    await ProductFactory.assertCount(11)
  }

  /**
   * Run your test.
   *
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToCreateANewProduct({ request }) {
    const payload = {
      title: 'iPhone X',
      description: 'Beautifully smartphone',
    }

    const response = await request.post('/api/products', { payload })

    response.assertStatusCode(201)
    response.assertBodyContains({
      data: {
        title: payload.title,
        description: payload.description,
      },
    })
    response.assertBodyNotContainsKey('data.createdAt')
    response.assertBodyNotContainsKey('data.updatedAt')
    response.assertBodyNotContainsKey('data.deletedAt')
  }

  /**
   * Run your test.
   *
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToFindAProduct({ request }) {
    const response = await request.get(`/api/products/${this._macbookPdt.id}`)

    response.assertStatusCode(200)
    response.assertBodyContains({
      data: {
        title: this._macbookPdt.title,
        description: this._macbookPdt.description,
      },
    })
    response.assertBodyNotContainsKey('data.createdAt')
    response.assertBodyNotContainsKey('data.updatedAt')
    response.assertBodyNotContainsKey('data.deletedAt')
  }

  /**
   * Run your test.
   *
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldThrowAnNotFoundExceptionWhenProductDoesNotExist({ request }) {
    const response = await request.get('/api/products/0')

    response.assertStatusCode(404)
    response.assertBodyContains({
      data: {
        statusCode: 404,
        code: 'E_NOT_FOUND_ERROR',
        message: 'Model not found.',
      },
    })
  }

  /**
   * Run your test.
   *
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToUpdateAProduct({ request }) {
    const payload = {
      title: 'Macbook Pro 2022',
      description: 'Beautifully macbook v2',
    }

    const response = await request.put(`/api/products/${this._macbookPdt.id}`, { payload })

    response.assertStatusCode(200)
    response.assertBodyContains({
      data: {
        title: payload.title,
        description: payload.description,
      },
    })
    response.assertBodyNotContainsKey('data.createdAt')
    response.assertBodyNotContainsKey('data.updatedAt')
    response.assertBodyNotContainsKey('data.deletedAt')
  }

  /**
   * Run your test.
   *
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToDeleteAProduct({ request }) {
    const response = await request.delete(`/api/products/${this._macbookPdt.id}?force=true`)

    response.assertStatusCode(204)

    await ProductFactory.assertNotExists({ id: this._macbookPdt.id })
  }

  /**
   * Run your test.
   *
   * @param {import('@athenna/test').HttpTestContext} ctx
   */
  async shouldBeAbleToSoftDeleteAProduct({ request }) {
    const response = await request.delete(`/api/products/${this._macbookPdt.id}`)

    response.assertStatusCode(204)

    await ProductFactory.assertSoftDelete({ id: this._macbookPdt.id })
  }
}
