import { Facade } from '@athenna/ioc'

/*
|--------------------------------------------------------------------------
| Facades
|--------------------------------------------------------------------------
|
| Athenna facades serve as "static proxies" to underlying classes in the
| service container, providing the benefit of a terse, expressive syntax
| while maintaining more testability and flexibility than traditional
| static methods.
|
*/

/** @type {Facade & import('@prisma/client').PrismaClient} */
export const Database = Facade.createFor('Athenna/Database')
