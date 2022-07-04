export class Criteria {
  #where
  #select
  #orderBy
  #distinct

  constructor() {
    this.#where = {}
    this.#select = {}
    this.#orderBy = {}
    this.#distinct = []
  }

  where(key, value) {
    this.#where[key] = value

    return this
  }

  select(key) {
    this.#select[key] = true

    return this
  }

  unSelect(key) {
    this.#select[key] = false

    return this
  }

  orderBy(key, value) {
    this.#orderBy[key] = value

    return this
  }

  distinct(key) {
    if (this.#distinct.find(d => d === key)) {
      return this
    }

    this.#distinct.push(key)

    return this
  }

  getWhere() {
    if (!Object.entries(this.#where).length) {
      return null
    }

    return this.#where
  }

  getSelect() {
    if (!Object.entries(this.#select).length) {
      return null
    }

    return this.#select
  }

  getOrderBy() {
    if (!Object.entries(this.#orderBy).length) {
      return null
    }

    return this.#orderBy
  }

  getDistinct() {
    if (!this.#distinct.length) {
      return null
    }

    return this.#distinct
  }
}
