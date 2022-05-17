import { Artisan } from '@athenna/artisan'
import { File, Path } from '@secjs/utils'

/*
|--------------------------------------------------------------------------
| Console Commands
|--------------------------------------------------------------------------
|
| Here is where you can register console commands for your application.
| These commands are loaded by the ArtisanProvider.
|
*/

Artisan.command('hello', function () {
  this.success('Hello from Athenna!')
})
  .description('Athenna just says hello.')
  .createHelp()

Artisan.command('prisma:fix', async function () {
  const prismaTypeFile = await new File(Path.nodeModules('.prisma/client/index.d.ts')).load()

  await File.safeRemove(Path.nodeModules('@prisma/client/index.d.ts'))
  await prismaTypeFile.copy(Path.nodeModules('@prisma/client/index.d.ts'))

  this.success('Prisma types successfully fixed!')
})
  .description('Fix prisma types inside node_modules.')
  .createHelp()
