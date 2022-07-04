import { Exec } from '@secjs/utils'
import { Criteria } from '#app/Models/Criteria'
import { NotFoundException } from '#app/Exceptions/NotFoundException'

export class Model {
  /** @type {any} */
  #select = {}

  /** @type {import('#app/Models/Criteria').Criteria[]} */
  #criterias = []

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
   * The attributes that will be selected in database operations.
   *
   *  @return {string[]}
   */
  get attributes() {
    return ['*']
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
    if (this.hasCriteria(criteria)) {
      return this
    }

    this.#criterias.push(criteria)

    return this
  }

  /**
   * Verify if model instance already have the criteria.
   *
   * @param {import('#app/Models/Criteria').Criteria} criteria
   * @return {boolean}
   */
  hasCriteria(criteria) {
    return !!this.#criterias.find(c => c === criteria)
  }

  /**
   * Remove a criteria from the model instance.
   *
   * @param {import('#app/Models/Criteria').Criteria} criteria
   * @return {this}
   */
  removeCriteria(criteria) {
    if (!this.hasCriteria(criteria)) {
      return this
    }

    delete this.#criterias[this.#criterias.findIndex(c => c === criteria)]

    return this
  }

  /**
   * The main prisma model to make more specific queries.
   *
   * @return {import('@prisma/client').Prisma.ProductDelegate}
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

    const query = {
      ...this.#getParsedCriterias(),
      ...filters,
    }

    delete query.select

    return this.query().count(query)
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

    const models = await this.findMany({
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
    filters = this.#setPkTypeOnFilters(filters)

    return this.findMany({
      skip: page,
      take: limit,
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
      ...this.#getParsedCriterias(),
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
    const model = await this.findOne(filters)

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

    return this.query().findMany({
      ...this.#getParsedCriterias(),
      ...filters,
    })
  }

  /**
   * Create one model.
   *
   * @param {any} data
   * @param {boolean} [ignorePersistOnly]
   * @return {Promise<any>}
   */
  async create(data, ignorePersistOnly = false) {
    this.#setDefaultCriterias()

    const query = { data, select: this.#select }

    if (!Object.entries(this.#select).length) {
      delete query.select
    }

    if (ignorePersistOnly) {
      return this.query().create(query)
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

    query.data = createObject

    return this.query().create(query)
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

    const query = {
      data,
      select: this.#select,
      where: {
        [this.primaryKey]: model[this.primaryKey],
      },
    }

    if (!Object.entries(this.#select).length) {
      delete query.select
    }

    if (ignorePersistOnly) {
      return this.query().update(query)
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

    query.data = updateObject

    return this.query().update(query)
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

  #getParsedCriterias() {
    this.#setDefaultCriterias()

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

      if (criteria.getDistinct()) {
        criterias.distinct = criteria.getDistinct()
      }
    })

    return criterias
  }

  #setDefaultCriterias() {
    if (this.isSoftDelete) {
      this.addCriteria(new Criteria().where(this.DELETED_AT, null))
    }

    if (this.attributes[0] === '*') {
      return
    }

    const criteria = new Criteria()

    this.attributes.forEach(attribute => criteria.select(attribute))

    this.addCriteria(criteria)
    this.#select = criteria.getSelect()
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
