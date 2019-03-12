import {AdminConfig} from './AdminConfig'

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
export const AdminDashboard = {
  schemas: {},
  sidebarItems: [],
  collectionItems: [],
  configure(config) {
    AdminConfig.set(config)
  },
  alertSuccess (message) {
    return Session.set('adminSuccess', message)
  },
  alertFailure (message) {
    return Session.set('adminError', message)
  },

  checkAdmin () {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Meteor.call('adminCheckAdmin')
      if (typeof AdminConfig.get().nonAdminRedirectRoute === 'string') {
			  Router.go(AdminConfig.get().nonAdminRedirectRoute)
      }
    }
    if (typeof this.next === 'function') {
      return this.next()
    }
  },
  adminRoutes: ['adminDashboard', 'adminDashboardUsersNew', 'adminDashboardUsersEdit', 'adminDashboardView', 'adminDashboardNew', 'adminDashboardEdit'],
  collectionLabel (collection) {
    if (collection === 'Users') {
      return 'Users'
    } else if ((collection != null) && (typeof (AdminConfig.get().collections[collection] != null ? AdminConfig.get().collections[collection].label : undefined) === 'string')) {
      return AdminConfig.get().collections[collection].label
    } else { return Session.get('admin_collection_name') }
  },

  addSidebarItem (title, url, options) {
    const item = { title }
    if (_.isObject(url) && (typeof options === 'undefined')) {
      item.options = url
    } else {
      item.url = url
      item.options = options
    }

    return this.sidebarItems.push(item)
  },

  extendSidebarItem (title, urls) {
    if (_.isObject(urls)) { urls = [urls] }

    const existing = _.find(this.sidebarItems, item => item.title === title)
    if (existing) {
      return existing.options.urls = _.union(existing.options.urls, urls)
    }
  },

  addCollectionItem (fn) {
    return this.collectionItems.push(fn)
  },

  path (s) {
    let path = '/admin'
    if ((typeof s === 'string') && (s.length > 0)) {
      path += (s[0] === '/' ? '' : '/') + s
    }
    return path
  }
}

AdminDashboard.schemas.newUser = new SimpleSchema({
  email: {
    type: String,
    label: 'Email address'
  },
  chooseOwnPassword: {
    type: Boolean,
    label: 'Let this user choose their own password with an email',
    defaultValue: true
  },
  password: {
    type: String,
    label: 'Password',
    optional: true
  },
  sendPassword: {
    type: Boolean,
    label: 'Send this user their password by email',
    optional: true
  }
})

AdminDashboard.schemas.sendResetPasswordEmail = new SimpleSchema({
  _id: {
    type: String
  }
})

AdminDashboard.schemas.changePassword = new SimpleSchema({
  _id: {
    type: String
  },
  password: {
    type: String
  }
})
