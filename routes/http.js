import { Route } from '@athenna/http'

/*
|--------------------------------------------------------------------------
| Http Routes
|--------------------------------------------------------------------------
|
| Here is where you can register http routes for your application. These
| routes are loaded by the HttpRouteProvider.
|
*/

Route.group(() => {
  Route.get('/', 'WelcomeController.show')

  Route.group(() => {
    Route.get('/', 'WelcomeController.show')
    Route.get('/welcome', 'WelcomeController.show')

    Route.get('products', 'ProductController.index').middleware('pagination')
    Route.resource('products', 'ProductController').except(['index'])
  }).prefix('/api')
})
