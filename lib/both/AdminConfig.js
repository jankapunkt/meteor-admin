import {Schema} from '../utils/Schema'

let _adminConfig = null
const configSchema = Schema.create({
  name: String,
  adminEmails: {
    type: Array,
    optional: true
  },
  'adminEmails.$': {
    type: String
  },
  collections: {
    type: Object,
    blackbox: true
  }
})

export const AdminConfig = {
  set(config) {
    configSchema.validate(config)
    _adminConfig = config
  },
  get() {
    return _adminConfig
  }
}
