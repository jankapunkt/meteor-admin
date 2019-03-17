/* global Roles */
import {Meteor} from 'meteor/meteor'
import { Template } from 'meteor/templating'
import {_} from 'meteor/underscore'
import { AdminConfig } from '../../both/AdminConfig'
import { AdminDashboard } from '../../both/AdminDashboard'
import {AdminCache} from '../../both/AdminCache'
import {AdminCollectionsCount} from '../../both/collections'
import { AdminTables } from '../../both/startup'

const wrap = fct => (...args) => {
  try {
    return fct(...args)
  } catch (error) {
    const userId = Meteor.userId()
    if (userId && Roles.userIsInRole(userId, 'admin')) {
      console.error(error)
    }
    return null
  }
}

const exists = obj => obj !== null && typeof obj !== 'undefined'

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
Template.registerHelper('AdminTables', wrap(() => AdminTables))

const adminCollections = function () {
  let collections = {}
  const config = AdminConfig.get()
  if (!config) {
    return void 0
  }
  if (typeof config.collections === 'object') {
    ({ collections } = config)
  }

  collections.Users = {
    collectionObject: Meteor.users,
    icon: 'user',
    label: 'Users',
    name: 'users'
  }

  return _.map(collections, function (obj, key) {
    obj = _.extend(obj, { name: key })
    obj = _.defaults(obj, { label: key, icon: 'plus', color: 'primary' })
    return obj = _.extend(obj, {
        viewPath: Router.path(`adminDashboard${key}View`),
        newPath: Router.path(`adminDashboard${key}New`)
      }
    )
  })
}

Template.registerHelper('AdminConfig', wrap(() => AdminConfig.get()))

Template.registerHelper('adminEq', wrap((a, b) => a === b))

Template.registerHelper('AdminCache', wrap(() => AdminCache))

Template.registerHelper('admin_skin', wrap(() => (AdminConfig.get().skin) || 'blue'))

Template.registerHelper('admin_collections', wrap(adminCollections))

Template.registerHelper('admin_collection_name', wrap(() => AdminCache.get('admin_collection_name')))

Template.registerHelper('admin_current_id', wrap(() => AdminCache.get('admin_id')))

Template.registerHelper('admin_current_doc', wrap(() => AdminCache.get('admin_doc')))

Template.registerHelper('admin_is_users_collection', wrap(() => AdminCache.get('admin_collection_name') === 'Users'))

Template.registerHelper('admin_sidebar_items', wrap(() => AdminDashboard.sidebarItems))

Template.registerHelper('admin_collection_items', wrap(() => {
  const items = []
  _.each(AdminDashboard.collectionItems, fn => {
    const item = fn(this.name, `/admin/${this.name}`)
    if ((item != null ? item.title : undefined) && (item != null ? item.url : undefined)) {
      return items.push(item)
    }
  })
  return items
}))

Template.registerHelper('admin_omit_fields', wrap(() => {
  let collection, _global
  const config = AdminConfig.get()
  if ((typeof config.autoForm !== 'undefined') && (typeof config.autoForm.omitFields === 'object')) {
    _global = config.autoForm.omitFields
  }
  const adminCollectionName = AdminCache.get('admin_collection_name')
  if (adminCollectionName !== 'Users' && exists(config.collections) &&
    exists(config.collections[ adminCollectionName ].omitFields)) {
    collection = config.collections[ adminCollectionName ].omitFields
  }
  if ((typeof _global === 'object') && (typeof collection === 'object')) {
    return _.union(_global, collection)
  } else if (typeof _global === 'object') {
    return _global
  } else if (typeof collection === 'object') {
    return collection
  }
}))

Template.registerHelper('AdminSchemas', wrap(() => AdminDashboard.schemas))

Template.registerHelper('adminGetSkin', wrap(() => {
  const config = AdminConfig.get()
  if ((typeof config.dashboard !== 'undefined') && (typeof config.dashboard.skin === 'string')) {
    return config.dashboard.skin
  } else {
    return 'blue'
  }
}))

Template.registerHelper('adminIsUserInRole', wrap((_id, role) => Roles.userIsInRole(_id, role)))

Template.registerHelper('adminGetUsers', wrap(() => Meteor.users))

Template.registerHelper('adminGetUserSchema', wrap(() => {
  let schema
  const config = AdminConfig.get()
  if (_.has(config, 'userSchema')) {
    schema = config.userSchema
  } else if (typeof Meteor.users._c2 === 'object') {
    schema = Meteor.users.simpleSchema()
  }

  return schema
}))

Template.registerHelper('adminCollectionLabel', wrap((collection) => {
  if (collection != null) { return AdminDashboard.collectionLabel(collection) }
}))

Template.registerHelper('adminCollectionCount', wrap((collection) => {
  if (collection === 'Users') {
    return Meteor.users.find().count()
  } else {
    return __guard__(AdminCollectionsCount.findOne({ collection }), x => x.count)
  }
}))

Template.registerHelper('adminTemplate', wrap((collectionName, mode) => {
  const config = AdminConfig.get()
  if (!collectionName || collectionName.toLowerCase() === 'users') {
    return (void 0)
  }
  const collection = config.collections[collectionName]
  if (!collection) {
    return (void 0)
  }
  const { templates } = collection
  return templates && templates[ mode ]
}))

Template.registerHelper('adminGetCollection', wrap(collection => _.find(adminCollections(), item => item.name === collection)))

Template.registerHelper('adminWidgets', wrap(() => {
  const config = AdminConfig.get()
  if ((typeof config.dashboard !== 'undefined') && (typeof config.dashboard.widgets !== 'undefined')) {
    return config.dashboard.widgets
  }
}))

Template.registerHelper('adminUserEmail', wrap((user) => {
  if (user && user.emails && user.emails[ 0 ] && user.emails[ 0 ].address) {
    return user.emails[ 0 ].address
  } else if (user && user.services && user.services.facebook && user.services.facebook.email) {
    return user.services.facebook.email
  } else if (user && user.services && user.services.google && user.services.google.email) {
    return user.services.google.email
  }
}))

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}
