import { Database } from '#providers/Facades/Database'

/*
|--------------------------------------------------------------------------
| Product model
|--------------------------------------------------------------------------
|
| Here is where we define our model using the Database facade. Prisma has a
| bug when using ESM. He is not rendering the types correctly from
| `@prisma/client/index.d.ts` file in your IDE. To fix this you can run the
| `node artisan prisma:fix` command.
|
*/
export const Product = Database.product
