/* global $ */
import { Meteor } from 'meteor/meteor'
import {check, Match} from 'meteor/check'
import {Template} from 'meteor/templating'
import {Blaze} from 'meteor/blaze'
import {_} from 'meteor/underscore'
import {AdminConfig} from './AdminConfig'
import {AdminDashboard} from './AdminDashboard'
import {AdminCache} from './AdminCache'
import { adminCollectionObject, parseID } from './utils'
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
export const AdminTables = {}

const adminTablesDom = '<"box w-100"<"box-header"<"box-toolbar d-flex"<"mr-auto"<"form-inline"lf>><"ml-auto"p>>><"box-body"t>><r>'

const adminEditButton = {
  data: '_id',
  title: 'Edit',
  createdCell (node, cellData, rowData) {
    return $(node).html(Blaze.toHTMLWithData(Template.adminEditBtn, { _id: cellData }))
  },
  width: '40px',
  orderable: false
}
const adminDelButton = {
  data: '_id',
  title: 'Delete',
  createdCell (node, cellData, rowData) {
    return $(node).html(Blaze.toHTMLWithData(Template.adminDeleteBtn, { _id: cellData }))
  },
  width: '40px',
  orderable: false
}

const adminEditDelButtons = [
  adminEditButton,
  adminDelButton
]

const defaultColumns = () => [{
  data: '_id',
  title: 'ID'
}
]

const adminTablePubName = collection => `admin_tabular_${collection}`

const adminCreateTables = collections =>
  _.each(AdminConfig.get().collections, function (collection, name) {
    _.defaults(collection, {
      showEditColumn: true,
      showDelColumn: true,
      showInSideBar: true
    })

    let columns = _.map(collection.tableColumns, function (column) {
      let createdCell
      if (column.template) {
        createdCell = function (node, cellData, rowData) {
          $(node).html('')
          return Blaze.renderWithData(Template[column.template], { value: cellData, doc: rowData }, node)
        }
      }

      return {
        data: column.name,
        title: column.label,
        createdCell
      }
    })

    if (columns.length === 0) {
      columns = defaultColumns()
    }

    if (collection.showEditColumn) {
      columns.push(adminEditButton)
    }
    if (collection.showDelColumn) {
      columns.push(adminDelButton)
    }

    return AdminTables[name] = new Tabular.Table({
      name,
      collection: adminCollectionObject(name),
      pub: collection.children && adminTablePubName(name),
      sub: collection.sub,
      columns,
      extraFields: collection.extraFields,
      dom: adminTablesDom,
      selector: collection.selector || (() => ({})) })
  })

const adminCreateRoutes = function (collections) {
  _.each(collections, adminCreateRouteView)
  _.each(collections,	adminCreateRouteNew)
  return _.each(collections, adminCreateRouteEdit)
}

const adminCreateRouteView = (collection, collectionName) =>
  Router.route(`adminDashboard${collectionName}View`,
    adminCreateRouteViewOptions(collection, collectionName))

const adminCreateRouteViewOptions = function (collection, collectionName) {
  const options = {
    path: `/admin/${collectionName}`,
    template: 'AdminDashboardViewWrapper',
    controller: 'AdminController',
    data () {
  		return { admin_table: AdminTables[collectionName] }
    },
    action () {
      return this.render()
    },
    onAfterAction () {
      AdminCache.set('admin_title', collectionName)
      AdminCache.set('admin_subtitle', 'View')
      AdminCache.set('admin_collection_name', collectionName)
      return __guard__(collection.routes != null ? collection.routes.view : undefined, x => x.onAfterAction)
    }
  }
  return _.defaults(options, collection.routes != null ? collection.routes.view : undefined)
}

const adminCreateRouteNew = (collection, collectionName) =>
  Router.route(`adminDashboard${collectionName}New`,
    adminCreateRouteNewOptions(collection, collectionName))

const adminCreateRouteNewOptions = function (collection, collectionName) {
  const options = {
    path: `/admin/${collectionName}/new`,
    template: 'AdminDashboardNew',
    controller: 'AdminController',
    action () {
      return this.render()
    },
    onAfterAction () {
      AdminCache.set('admin_title', AdminDashboard.collectionLabel(collectionName))
      AdminCache.set('admin_subtitle', 'Create new')
      AdminCache.set('admin_collection_page', 'new')
      AdminCache.set('admin_collection_name', collectionName)
      return __guard__(collection.routes != null ? collection.routes.new : undefined, x => x.onAfterAction)
    },
    data () {
      return { admin_collection: adminCollectionObject(collectionName) }
    }
  }
  return _.defaults(options, collection.routes != null ? collection.routes.new : undefined)
}

const adminCreateRouteEdit = (collection, collectionName) =>
  Router.route(`adminDashboard${collectionName}Edit`,
    adminCreateRouteEditOptions(collection, collectionName))

const adminCreateRouteEditOptions = function (collection, collectionName) {
  const options = {
    path: `/admin/${collectionName}/:_id/edit`,
    template: 'AdminDashboardEdit',
    controller: 'AdminController',
    waitOn () {
      Meteor.subscribe('adminCollectionDoc', collectionName, parseID(this.params._id))
      return __guard__(collection.routes != null ? collection.routes.edit : undefined, x => x.waitOn)
    },
    action () {
      return this.render()
    },
    onAfterAction () {
      AdminCache.set('admin_title', AdminDashboard.collectionLabel(collectionName))
      AdminCache.set('admin_subtitle', `Edit ${this.params._id}`)
      AdminCache.set('admin_collection_page', 'edit')
      AdminCache.set('admin_collection_name', collectionName)
      AdminCache.set('admin_id', parseID(this.params._id))
      AdminCache.set('admin_doc', adminCollectionObject(collectionName).findOne({ _id: parseID(this.params._id) }))
      return __guard__(collection.routes != null ? collection.routes.edit : undefined, x => x.onAfterAction)
    },
    data () {
      return { admin_collection: adminCollectionObject(collectionName) }
    }
  }
  return _.defaults(options, collection.routes != null ? collection.routes.edit : undefined)
}

const adminPublishTables = collections =>
  _.each(collections, function (collection, name) {
    if (!collection.children) { return undefined }
    return Meteor.publishComposite(adminTablePubName(name), function (tableName, ids, fields) {
      check(tableName, String)
      check(ids, Array)
      check(fields, Match.Optional(Object))

      const extraFields = _.reduce(collection.extraFields, function (fields, name) {
        fields[name] = 1
        return fields
      }
      , {})
      _.extend(fields, extraFields)

      this.unblock()

      return {
        find () {
          this.unblock()
          return adminCollectionObject(name).find({ _id: { $in: ids } }, { fields })
        },
        children: collection.children
      }
    })
  })

Meteor.startup(function () {
  const config = AdminConfig.get()
  if (!AdminConfig.get()) {
    throw new Error('[jkuester:admin] No config file present. Please read the docs on how to setup the config.')
  }

  adminCreateTables(config.collections)
  adminCreateRoutes(config.collections)
  if (Meteor.isServer) { adminPublishTables(config.collections) }

  if (AdminTables.Users) { return undefined }

  return AdminTables.Users = new Tabular.Table({
    // Modify selector to allow search by email
    changeSelector (selector, userId) {
      const $or = selector['$or']
      $or && (selector['$or'] = _.map($or, function (exp) {
        if ((exp.emails != null ? exp.emails['$regex'] : undefined) != null) {
          return { emails: { $elemMatch: { address: exp.emails } } }
        } else {
          return exp
        }
      }))
      return selector
    },

    name: 'Users',
    collection: Meteor.users,
    columns: _.union([
      {
        data: '_id',
        title: 'Admin',
        // TODO: use `tmpl`
        createdCell (node, cellData, rowData) {
          return $(node).html(Blaze.toHTMLWithData(Template.adminUsersIsAdmin, { _id: cellData }))
        },
        width: '40px'
      },
      {
        data: 'emails',
        title: 'Email',
        render (value) {
          return value[0].address
        },
        searchable: true
      },
      {
        data: 'emails',
        title: 'Mail',
        // TODO: use `tmpl`
        createdCell (node, cellData, rowData) {
          return $(node).html(Blaze.toHTMLWithData(Template.adminUsersMailBtn, { emails: cellData }))
        },
        width: '40px'
      },
      { data: 'createdAt', title: 'Joined' }
    ], adminEditDelButtons),
    dom: adminTablesDom
  })
})

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}
