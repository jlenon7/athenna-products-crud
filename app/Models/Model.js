import { Exec } from '@secjs/utils'
import { NotFoundException } from '#app/Exceptions/NotFoundException'

export class Model {
  /**
   * The data type of the auto-incrementing ID.
   *
   * @return {string}
   */
  get keyType() {
    return 'number'
  }

  /**
   * Return the CREATED_AT column name in database.
   *
   *  @return {string}
   */
  get CREATED_AT() {
    return 'createdAt'
  }

  /**
   * Return the UPDATED_AT column name in database.
   *
   *  @return {string}
   */
  get UPDATED_AT() {
    return 'updatedAt'
  }

  /**
   * Return the DELETED_AT column name in database.
   *
   *  @return {string}
   */
  get DELETED_AT() {
    return 'deletedAt'
  }

  /**
   * The primary key associated with the table.
   *
   *  @return {string}
   */
  get primaryKey() {
    return 'id'
  }

  /**
   * The attributes that could be persisted in database.
   *
   *  @return {string[]}
   */
  get persistOnly() {
    return ['*']
  }

  /**
   * The main prisma model to make more specific queries.
   *
   * @return {any}
   */
  query() {}

  /**
   * Count the number of models.
   *
   * @param {any} [filters]
   * @return {Promise<number>}
   */
  async count(filters = {}) {
    return this.query().count(filters)
  }

  /**
   * Paginate the models.
   *
   * @param {number} [page]
   * @param {number} [limit]
   * @param {string} [resourceUrl]
   * @param {any} [filters]
   * @return {Promise<import('@secjs/utils').PaginatedResponse>}
   */
  async paginate(page = 0, limit = 10, resourceUrl = '/', filters = {}) {
    const total = await this.count(filters)

    const models = await this.query().findMany({
      skip: page,
      take: limit,
      ...filters,
    })

    return Exec.pagination(models, total, { page, limit, resourceUrl })
  }

  /**
   * Paginate the models but without paginated response.
   *
   * @param {number} [page]
   * @param {number} [limit]
   * @param {any} [filters]
   * @return {Promise<any[]>}
   */
  async forPage(page = 0, limit = 10, filters = {}) {
    return this.query().findMany({
      skip: page,
      take: limit,
      ...filters,
    })
  }

  /**
   * Find one model using any value for the primary key defined in your Model.
   *
   * @param {any} value
   * @param {any} [filters]
   * @return {Promise<any>}
   */
  async findOne(value, filters = {}) {
    return this.query().findFirst({
      where: { [this.primaryKey]: this.#parsePrimaryKeyValue(value) },
      ...filters,
    })
  }

  /**
   * Find one model using any value for the primary key defined in your Model
   * or throw a not found exception.
   *
   * @param {any} value
   * @param {any} [filters]
   * @return {Promise<any>}
   */
  async findOneOrFail(value, filters = {}) {
    const model = await this.query().findFirst({
      where: { [this.primaryKey]: this.#parsePrimaryKeyValue(value) },
      ...filters,
    })

    if (!model) {
      throw new NotFoundException('Model not found.')
    }

    return model
  }

  /**
   * Find many models.
   *
   * @param {any} [filters]
   * @return {Promise<any[]>}
   */
  async findMany(filters = {}) {
    if (filters[this.primaryKey]) {
      filters[this.primaryKey] = this.#parsePrimaryKeyValue(
        filters[this.primaryKey],
      )
    }

    return this.query().findMany(filters)
  }

  /**
   * Create one model.
   *
   * @param {any} data
   * @param {boolean} [ignorePersistOnly]
   * @return {Promise<any>}
   */
  async create(data, ignorePersistOnly = false) {
    if (ignorePersistOnly) {
      return this.query().create({ data })
    }

    const createObject = {}

    Object.keys(data).forEach(key => {
      if (
        this.persistOnly[0] === '*' ||
        this.persistOnly.find(p => p === key)
      ) {
        createObject[key] = data[key]
      }
    })

    return this.query().create({ data: createObject })
  }

  /**
   * Update one model by primary key.
   *
   * @param {any} value
   * @param {any} data
   * @param {boolean} [ignorePersistOnly]
   * @return {Promise<any>}
   */
  async update(value, data, ignorePersistOnly = false) {
    const model = await this.findOneOrFail(value)

    if (ignorePersistOnly) {
      return this.query().update({
        data,
        where: {
          [this.primaryKey]: model[this.primaryKey],
        },
      })
    }

    const updateObject = {}

    Object.keys(data).forEach(key => {
      if (
        this.persistOnly[0] === '*' ||
        this.persistOnly.find(p => p === key)
      ) {
        updateObject[key] = data[key]
      }
    })

    return this.query().update({
      data: updateObject,
      where: {
        [this.primaryKey]: model[this.primaryKey],
      },
    })
  }

  /**
   * Delete one model by primary key.
   *
   * @param {any} value
   * @return {Promise<any>}
   */
  async delete(value) {
    const model = await this.findOneOrFail(value)

    await this.query().delete({
      where: {
        [this.primaryKey]: model[this.primaryKey],
      },
    })
  }

  /**
   * Soft delete one model by primary key.
   *
   * @param {any} value
   * @param {boolean} force
   * @return {Promise<any>}
   */
  async softDelete(value, force = false) {
    if (force) {
      return this.delete(value)
    }

    const model = await this.findOneOrFail(value)

    await this.query().update({
      data: { [this.DELETED_AT]: new Date() },
      where: {
        [this.primaryKey]: model[this.primaryKey],
      },
    })
  }

  /**
   * Parse the primary key value using the keyType getter.
   *
   * @param {string|number} value
   * @returns {string|number}
   */
  #parsePrimaryKeyValue(value) {
    if (this.keyType === 'number') return parseInt(value)

    return value
  }
}
