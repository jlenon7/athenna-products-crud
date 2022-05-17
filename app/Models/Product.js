import { Database } from '#providers/Facades/Database'

/**
 * Actually, PrismaORM has a bug when using ESM.
 * The types are not being rendered correctly
 */
export const Product = Database.product
