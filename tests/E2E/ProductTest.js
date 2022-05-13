import { test } from '@japa/runner'
import { Database } from '#providers/Facades/Database'

test.group('ProductTest', group => {
  /** @type {import('@prisma/client').Product} */
  let macbookPdt = null

  group.each.setup(async () => {
    macbookPdt = await Database.product.create({
      data: {
        title: 'Macbook Pro 2021',
        description: 'Beautifully macbook',
      },
    })
  })

  group.each.teardown(async () => {
    await Database.product.deleteMany()

    await Database.$disconnect()
  })

  test('should be able to list all products paginated', async ({ assert, request }) => {
    const statusCode = 200
    const method = 'GET'
    const path = '/api/products?limit=4'

    const { json } = await request({ path, method })

    const body = json()

    assert.equal(body.method, method)
    assert.equal(body.statusCode, statusCode)
    assert.equal(body.data.length, 1)
    assert.equal(body.data[0].id, macbookPdt.id)
    assert.equal(body.meta.itemCount, 1)
    assert.equal(body.meta.totalItems, 1)
    assert.equal(body.meta.totalPages, 1)
    assert.equal(body.meta.currentPage, 0)
    assert.equal(body.meta.itemsPerPage, 4)
    assert.equal(body.links.first, '/api/products?limit=4')
    assert.equal(body.links.previous, '/api/products?page=0&limit=4')
    assert.equal(body.links.next, '/api/products?page=1&limit=4')
    assert.equal(body.links.last, '/api/products?page=1&limit=4')
  })

  test('should be able to create a new product', async ({ assert, request }) => {
    const statusCode = 201
    const method = 'POST'
    const path = '/api/products'
    const payload = {
      title: 'iPhone X',
      description: 'Beautifully smartphone',
    }

    const { json } = await request({ path, method, payload })

    const body = json()

    assert.equal(body.method, method)
    assert.equal(body.statusCode, statusCode)
    assert.equal(body.data.title, payload.title)
    assert.equal(body.data.description, payload.description)
    assert.isDefined(body.data.createdAt)
    assert.isDefined(body.data.updatedAt)
    assert.isNull(body.data.deletedAt)
  })

  test('should be able to find a product', async ({ assert, request }) => {
    const statusCode = 200
    const method = 'GET'
    const path = `/api/products/${macbookPdt.id}`

    const { json } = await request({ path, method })

    const body = json()

    assert.equal(body.method, method)
    assert.equal(body.statusCode, statusCode)
    assert.equal(body.data.title, macbookPdt.title)
    assert.equal(body.data.description, macbookPdt.description)
  })

  test('should throw an not found exception when product does not exist', async ({ assert, request }) => {
    const statusCode = 404
    const method = 'GET'
    const path = '/api/products/0'

    const { json } = await request({ path, method })

    const body = json()

    assert.equal(body.method, method)
    assert.equal(body.status, 'ERROR')
    assert.equal(body.statusCode, statusCode)
    assert.equal(body.data.statusCode, statusCode)
    assert.equal(body.data.code, 'E_NOT_FOUND')
    assert.equal(body.data.message, 'Product not found')
  })

  test('should be able to update a product', async ({ assert, request }) => {
    const statusCode = 200
    const method = 'PUT'
    const path = `/api/products/${macbookPdt.id}`
    const payload = {
      title: 'Macbook Pro 2022',
      description: 'Beautifully macbook v2',
    }

    const { json } = await request({ path, method, payload })

    const body = json()

    assert.equal(body.method, method)
    assert.equal(body.statusCode, statusCode)
    assert.equal(body.data.title, payload.title)
    assert.equal(body.data.description, payload.description)
  })

  test('should be able to delete a product', async ({ assert, request }) => {
    const statusCode = 204
    const method = 'DELETE'
    const path = `/api/products/${macbookPdt.id}?force=true`

    const { json } = await request({ path, method })

    const body = json()

    const product = await Database.product.findFirst({ where: { id: macbookPdt.id } })

    assert.equal(body.method, method)
    assert.equal(body.statusCode, statusCode)
    assert.isNull(product)
  })

  test('should be able to soft delete a product', async ({ assert, request }) => {
    const statusCode = 204
    const method = 'DELETE'
    const path = `/api/products/${macbookPdt.id}`

    const { json } = await request({ path, method })

    const body = json()

    const product = await Database.product.findFirst({ where: { id: macbookPdt.id } })

    assert.equal(body.method, method)
    assert.equal(body.statusCode, statusCode)
    assert.isDefined(product.deletedAt)
  })
})
