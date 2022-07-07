import { Test } from '@athenna/test'
import { WelcomeService } from '#app/Services/WelcomeService'

export class WelcomeServiceTest extends Test {
  /**
   * Run your test.
   *
   * @param {import('@athenna/test').UnitTestContext} ctx
   */
  async shouldReturnConcreteWelcomePayloadFromService({ assert }) {
    const welcomeService = new WelcomeService()

    const { name, version, description, source } = await welcomeService.findOne()

    assert.equal(name, '@athenna/scaffold')
    assert.equal(version, '1.0.0')
    assert.equal(source, 'https://github.com/AthennaIO')
    assert.equal(
      description,
      "The Athenna scaffold project used by 'athenna new project' command to create your project.",
    )
  }
}
