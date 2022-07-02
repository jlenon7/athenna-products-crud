export class Criteria {
  #where
  #select
  #orderBy

  constructor() {
    this.#where = {}
    this.#select = {}
    this.#orderBy = {}
  }

  where(key, value) {
    this.#where[key] = value

    return this
  }

  select(key) {
    this.#select[key] = true

    return this
  }

  orderBy(key, value) {
    this.#orderBy[key] = value

    return this
  }

  getWhere() {
    if (Object.entries(this.#where).length === 0) {
      return null
    }

    return this.#where
  }

  getSelect() {
    if (Object.entries(this.#select).length === 0) {
      return null
    }

    return this.#select
  }

  getOrderBy() {
    if (Object.entries(this.#orderBy).length === 0) {
      return null
    }

    return this.#orderBy
  }
}
