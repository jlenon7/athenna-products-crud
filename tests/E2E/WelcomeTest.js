import { test } from '@japa/runner'

test.group('WelcomeTest', () => {
  test('should return mocked welcome payload from API', async ({ assert, request }) => {
    const statusCode = 200
    const path = '/api/welcome'

    const response = await request.get(path)

    response.assertStatusCode(statusCode)
    response.assertBodyContains({
      statusCode,
      method: 'GET',
      data: {
        mock: true,
      },
    })
  })
})
