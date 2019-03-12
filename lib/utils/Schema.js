import SimpleSchema from 'simpl-schema'

export const Schema = {
  create(def, options) {
    return new SimpleSchema(def, options)
  }
}