import { test } from '@japa/runner'
import { ProductFactory } from '#database/factories/ProductFactory'

test.group('ProductTest', group => {
  /** @type {import('@prisma/client').Product} */
  let macbookPdt = null

  group.each.setup(async () => {
    macbookPdt = await ProductFactory.createOne()
  })

  group.each.teardown(async () => {
    await ProductFactory.truncate()
  })

  test('should be able to list all products paginated', async ({ request }) => {
    const response = await request.get('/api/products?limit=4')

    response.assertStatusCode(200)
    response.assertBodyContains({
      data: [{ id: macbookPdt.id }],
      meta: {
        itemCount: 1,
        totalItems: 1,
        totalPages: 1,
        currentPage: 0,
        itemsPerPage: 4,
      },
      links: {
        first: '/api/products?limit=4',
        previous: '/api/products?page=0&limit=4',
        next: '/api/products?page=1&limit=4',
        last: '/api/products?page=1&limit=4',
      },
    })
  })

  test('should be able to create a new product', async ({ request }) => {
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
        deletedAt: null,
      },
    })
  })

  test('should be able to find a product', async ({ request }) => {
    const response = await request.get(`/api/products/${macbookPdt.id}`)

    response.assertStatusCode(200)
    response.assertBodyContains({
      data: {
        title: macbookPdt.title,
        description: macbookPdt.description,
      },
    })
  })

  test('should throw an not found exception when product does not exist', async ({ assert, request }) => {
    const response = await request.get('/api/products/0')

    response.assertStatusCode(404)
    response.assertBodyContains({
      data: {
        statusCode: 404,
        code: 'E_NOT_FOUND',
        message: 'Model not found',
      },
    })
  })

  test('should be able to update a product', async ({ assert, request }) => {
    const payload = {
      title: 'Macbook Pro 2022',
      description: 'Beautifully macbook v2',
    }

    const response = await request.put(`/api/products/${macbookPdt.id}`, { payload })

    response.assertStatusCode(200)
    response.assertBodyContains({
      data: {
        title: payload.title,
        description: payload.description,
      },
    })
  })

  test('should be able to delete a product', async ({ assert, request }) => {
    const response = await request.delete(`/api/products/${macbookPdt.id}?force=true`)

    response.assertStatusCode(204)

    await ProductFactory.assertNotExists({ id: macbookPdt.id })
  })

  test('should be able to soft delete a product', async ({ assert, request }) => {
    const response = await request.delete(`/api/products/${macbookPdt.id}`)

    response.assertStatusCode(204)

    await ProductFactory.assertSoftDelete({ id: macbookPdt.id })
  })
})
