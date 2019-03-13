import {AdminConfig} from '../../both/AdminConfig'
import {AdminDashboard} from '../../both/AdminDashboard'
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
Template.registerHelper('AdminTables', AdminTables)

const adminCollections = function () {
  let collections = {}
  const config = AdminConfig.get()
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
    obj = _.defaults(obj, { label: key, icon: 'plus', color: 'blue' })
    return obj = _.extend(obj, {
      viewPath: Router.path(`adminDashboard${key}View`),
      newPath: Router.path(`adminDashboard${key}New`)
    }
    )
  })
}

Template.registerHelper('AdminConfig', function () {
  return AdminConfig.get()
})

Template.registerHelper('admin_skin', () => (AdminConfig.get().skin) || 'blue')

Template.registerHelper('admin_collections', adminCollections)

Template.registerHelper('admin_collection_name', () => Session.get('admin_collection_name'))

Template.registerHelper('admin_current_id', () => Session.get('admin_id'))

Template.registerHelper('admin_current_doc', () => Session.get('admin_doc'))

Template.registerHelper('admin_is_users_collection', () => Session.get('admin_collection_name') === 'Users')

Template.registerHelper('admin_sidebar_items', () => AdminDashboard.sidebarItems)

Template.registerHelper('admin_collection_items', function () {
  const items = []
  _.each(AdminDashboard.collectionItems, fn => {
    const item = fn(this.name, `/admin/${this.name}`)
    if ((item != null ? item.title : undefined) && (item != null ? item.url : undefined)) {
      return items.push(item)
    }
  })
  return items
})

Template.registerHelper('admin_omit_fields', function () {
  let collection, global
  if ((typeof AdminConfig.autoForm !== 'undefined') && (typeof AdminConfig.autoForm.omitFields === 'object')) {
    global = AdminConfig.autoForm.omitFields
  }
  if (!Session.equals('admin_collection_name', 'Users') && (typeof AdminConfig !== 'undefined') && (typeof AdminConfig.collections[Session.get('admin_collection_name')].omitFields === 'object')) {
    collection = AdminConfig.collections[Session.get('admin_collection_name')].omitFields
  }
  if ((typeof global === 'object') && (typeof collection === 'object')) {
    return _.union(global, collection)
  } else if (typeof global === 'object') {
    return global
  } else if (typeof collection === 'object') {
    return collection
  }
})

Template.registerHelper('AdminSchemas', () => AdminDashboard.schemas)

Template.registerHelper('adminGetSkin', function () {
  const config = AdminConfig.get()
  if ((typeof config.dashboard !== 'undefined') && (typeof config.dashboard.skin === 'string')) {
    return config.dashboard.skin
  } else {
    return 'blue'
  }
})

Template.registerHelper('adminIsUserInRole', (_id, role) => Roles.userIsInRole(_id, role))

Template.registerHelper('adminGetUsers', () => Meteor.users)

Template.registerHelper('adminGetUserSchema', function () {
  let schema
  const config = AdminConfig.get()
  if (_.has(config, 'userSchema')) {
    schema = config.userSchema
  } else if (typeof Meteor.users._c2 === 'object') {
    schema = Meteor.users.simpleSchema()
  }

  return schema
})

Template.registerHelper('adminCollectionLabel', function (collection) {
  if (collection != null) { return AdminDashboard.collectionLabel(collection) }
})

Template.registerHelper('adminCollectionCount', function (collection) {
  if (collection === 'Users') {
    return Meteor.users.find().count()
  } else {
    return __guard__(AdminCollectionsCount.findOne({ collection }), x => x.count)
  }
})

Template.registerHelper('adminTemplate', function (collection, mode) {
  const config = AdminConfig.get()
  if (((collection != null ? collection.toLowerCase() : undefined) !== 'users') && (typeof __guard__(__guard__(config.collections, x1 => x1[collection]), x => x.templates) !== 'undefined')) {
    return config.collections[collection].templates[mode]
  }
})

Template.registerHelper('adminGetCollection', collection => _.find(adminCollections(), item => item.name === collection))

Template.registerHelper('adminWidgets', function () {
  const config = AdminConfig.get()
  if ((typeof config.dashboard !== 'undefined') && (typeof config.dashboard.widgets !== 'undefined')) {
    return config.dashboard.widgets
  }
})

Template.registerHelper('adminUserEmail', function (user) {
  if (user && user.emails && user.emails[0] && user.emails[0].address) {
    return user.emails[0].address
  } else if (user && user.services && user.services.facebook && user.services.facebook.email) {
    return user.services.facebook.email
  } else if (user && user.services && user.services.google && user.services.google.email) {
    return user.services.google.email
  }
})

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}
