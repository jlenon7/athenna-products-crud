import { Exec } from '@secjs/utils'
import { Criteria } from '#app/Models/Criteria'
import { NotFoundException } from '#app/Exceptions/NotFoundException'

export class Model {
  /** @type {import('#app/Models/Criteria').Criteria[]} */
  #criterias = []

  constructor() {
    if (this.isSoftDelete) {
      this.addCriteria(new Criteria().where(this.DELETED_AT, null))
    }
  }

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
   * Return a boolean specifying if Model will use soft delete.
   *
   *  @return {boolean}
   */
  get isSoftDelete() {
    return false
  }

  /**
   * Add a new criteria to the model instance.
   *
   * @param {import('#app/Models/Criteria').Criteria} criteria
   * @return {this}
   */
  addCriteria(criteria) {
    this.#criterias.push(criteria)

    return this
  }

  /**
   * Remove a criteria from the model instance.
   *
   * @param {import('#app/Models/Criteria').Criteria} criteria
   * @return {this}
   */
  removeCriteria(criteria) {
    const index = this.#criterias.findIndex(c => c === criteria)

    delete this.#criterias[index]

    return this
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
    filters = this.#setPkTypeOnFilters(filters)

    return this.query().count({ ...this.#parseCriterias(), ...filters })
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
    filters = this.#setPkTypeOnFilters(filters)

    const total = await this.count(filters)

    const models = await this.query().findMany({
      skip: page,
      take: limit,
      ...this.#parseCriterias(),
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
    filters = this.#setPkTypeOnFilters(filters)

    return this.query().findMany({
      skip: page,
      take: limit,
      ...this.#parseCriterias(),
      ...filters,
    })
  }

  /**
   * Find one model by filters.
   *
   * @param {any} [filters]
   * @return {Promise<any>}
   */
  async findOne(filters = {}) {
    filters = this.#setPkTypeOnFilters(filters)

    if (!filters.where) filters.where = {}

    return this.query().findFirst({
      ...this.#parseCriterias(),
      ...filters,
    })
  }

  /**
   * Find one model by filters or throw a not found exception.
   *
   * @param {any} [filters]
   * @return {Promise<any>}
   */
  async findOneOrFail(filters = {}) {
    filters = this.#setPkTypeOnFilters(filters)

    if (!filters.where) filters.where = {}

    const model = await this.query().findFirst({
      ...this.#parseCriterias(),
      ...filters,
    })

    if (!model) {
      throw new NotFoundException('Model not found.')
    }

    return model
  }

  /**
   * Find one model using any value for the primary key defined in your Model.
   *
   * @param {any} value
   * @param {any} [filters]
   * @return {Promise<any>}
   */
  async findOneByPk(value, filters = {}) {
    return this.findOne({ where: { [this.primaryKey]: value }, ...filters })
  }

  /**
   * Find one model using any value for the primary key defined in your Model
   * or throw a not found exception.
   *
   * @param {any} value
   * @param {any} [filters]
   * @return {Promise<any>}
   */
  async findOneByPkOrFail(value, filters = {}) {
    return this.findOneOrFail({
      where: { [this.primaryKey]: value },
      ...filters,
    })
  }

  /**
   * An alias for findOneByPk.
   *
   * @param {any} id
   * @param {any} [filters]
   * @return {Promise<any>}
   */
  async findById(id, filters = {}) {
    return this.findOneByPk(id, filters)
  }

  /**
   * An alias for findOneByPkOrFail.
   *
   * @param {any} id
   * @param {any} [filters]
   * @return {Promise<any>}
   */
  async findByIdOrFail(id, filters = {}) {
    return this.findOneByPkOrFail(id, filters)
  }

  /**
   * Find many models.
   *
   * @param {any} [filters]
   * @return {Promise<any[]>}
   */
  async findMany(filters = {}) {
    filters = this.#setPkTypeOnFilters(filters)

    return this.query().findMany({ ...this.#parseCriterias(), ...filters })
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
   * @param {any} filters
   * @param {any} data
   * @param {boolean} [ignorePersistOnly]
   * @return {Promise<any>}
   */
  async update(filters = {}, data, ignorePersistOnly = false) {
    const model = await this.findOneOrFail(filters)

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
   * Soft delete one model by filters.
   *
   * @param {any} [filters]
   * @param {boolean} [force]
   * @return {Promise<any>}
   */
  async delete(filters = {}, force = false) {
    const model = await this.findOneOrFail(filters)

    if (this.isSoftDelete && !force) {
      await this.query().update({
        data: { [this.DELETED_AT]: new Date() },
        where: {
          [this.primaryKey]: model[this.primaryKey],
        },
      })

      return
    }

    return this.query().delete({
      where: { [this.primaryKey]: model[this.primaryKey] },
    })
  }

  /**
   * Update one model by primary key.
   *
   * @param {any} value
   * @param {any} data
   * @param {boolean} [ignorePersistOnly]
   * @return {Promise<any>}
   */
  async updateByPk(value, data, ignorePersistOnly = false) {
    return this.update(
      { where: { [this.primaryKey]: value } },
      data,
      ignorePersistOnly,
    )
  }

  /**
   * Soft delete one model by primary key.
   *
   * @param {any} value
   * @param {boolean} [force]
   * @return {Promise<any>}
   */
  async deleteByPk(value, force = false) {
    return this.delete({ where: { [this.primaryKey]: value } }, force)
  }

  /**
   * An alias for updateByPk.
   *
   * @param {any} id
   * @param {any} data
   * @param {boolean} [ignorePersistOnly]
   * @return {Promise<any>}
   */
  async updateById(id, data, ignorePersistOnly = false) {
    return this.updateByPk(id, data, ignorePersistOnly)
  }

  /**
   * An alias for deleteByPk.
   *
   * @param {any} id
   * @param {boolean} [force]
   * @return {Promise<any>}
   */
  async deleteById(id, force = false) {
    return this.deleteByPk(id, force)
  }

  /**
   * Parse the primary key value using the keyType getter.
   *
   * @param {string|number} value
   * @return {string|number}
   */
  #parsePrimaryKeyValue(value) {
    if (this.keyType === 'number') return parseInt(value)

    return value
  }

  #parseCriterias() {
    const criterias = {}

    this.#criterias.forEach(criteria => {
      if (criteria.getWhere()) {
        criterias.where = criteria.getWhere()
      }

      if (criteria.getSelect()) {
        criterias.select = criteria.getSelect()
      }

      if (criteria.getOrderBy()) {
        criterias.orderBy = criteria.getOrderBy()
      }
    })

    return criterias
  }

  #setPkTypeOnFilters(filters) {
    if (filters.where && filters.where[this.primaryKey]) {
      filters.where[this.primaryKey] = this.#parsePrimaryKeyValue(
        filters.where[this.primaryKey],
      )
    }

    return filters
  }
}
