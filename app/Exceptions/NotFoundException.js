import { Exception } from '@athenna/core'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@athenna/core` allows defining
| a status code, error code and help for every exception.
|
| @example
| new NotFoundException('message', 500, 'E_RUNTIME_EXCEPTION', 'Restart computer.')
|
*/

export class NotFoundException extends Exception {
  /**
   * Return a new instance of NotFoundException.
   *
   * @param {string} [message]
   * @param {number} [statusCode]
   * @param {string} [code]
   * @param {string} [help]
   */
  constructor(message, statusCode = 404, code = 'E_NOT_FOUND', help) {
    super(message, statusCode, code, help)
  }
}
