import {Meteor} from 'meteor/meteor'
import {AdminConfig} from './AdminConfig'
import {AdminCache} from './AdminCache'
import { AdminTables } from './startup'
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
this.AdminController = RouteController.extend({
  layoutTemplate: 'AdminLayout',
  waitOn () {
    return [
      Meteor.subscribe('adminUsers'),
      Meteor.subscribe('adminUser'),
      Meteor.subscribe('adminCollectionsCount')
    ]
  },
  onBeforeAction () {
    AdminCache.set('adminSuccess', null)
    AdminCache.set('adminError', null)

    AdminCache.set('admin_title', '')
    AdminCache.set('admin_subtitle', '')
    AdminCache.set('admin_collection_page', null)
    AdminCache.set('admin_collection_name', null)
    AdminCache.set('admin_id', null)
    AdminCache.set('admin_doc', null)

    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Meteor.call('adminCheckAdmin')
      const config = AdminConfig.get()
      if (typeof config.nonAdminRedirectRoute === 'string') {
        Router.go(config.nonAdminRedirectRoute)
      }
    }

    return this.next()
  }
})

Router.route('adminDashboard', {
  path: '/admin',
  template: 'AdminDashboard',
  controller: 'AdminController',
  action () {
    return this.render()
  },
  onAfterAction () {
    AdminCache.set('admin_title', 'Dashboard')
    AdminCache.set('admin_collection_name', '')
    return AdminCache.set('admin_collection_page', '')
  }
})

Router.route('adminDashboardUsersView', {
  path: '/admin/Users',
  template: 'AdminDashboardView',
  controller: 'AdminController',
  action () {
    return this.render()
  },
  data () {
    return { admin_table: AdminTables.Users }
  },
  onAfterAction () {
    AdminCache.set('admin_title', 'Users')
    AdminCache.set('admin_subtitle', 'View')
    return AdminCache.set('admin_collection_name', 'Users')
  }
}
)

Router.route('adminDashboardUsersNew', {
  path: '/admin/Users/new',
  template: 'AdminDashboardUsersNew',
  controller: 'AdminController',
  action () {
    return this.render()
  },
  onAfterAction () {
    AdminCache.set('admin_title', 'Users')
    AdminCache.set('admin_subtitle', 'Create new user')
    AdminCache.set('admin_collection_page', 'New')
    return AdminCache.set('admin_collection_name', 'Users')
  }
}
)

Router.route('adminDashboardUsersEdit', {
  path: '/admin/Users/:_id/edit',
  template: 'AdminDashboardUsersEdit',
  controller: 'AdminController',
  data () {
    return {
      user: Meteor.users.find(this.params._id).fetch(),
      roles: Roles.getRolesForUser(this.params._id),
      otherRoles: _.difference(_.map(Meteor.roles.find().fetch(), role => role.name), Roles.getRolesForUser(this.params._id))
    }
  },
  action () {
    return this.render()
  },
  onAfterAction () {
    AdminCache.set('admin_title', 'Users')
    AdminCache.set('admin_subtitle', `Edit user ${this.params._id}`)
    AdminCache.set('admin_collection_page', 'edit')
    AdminCache.set('admin_collection_name', 'Users')
    AdminCache.set('admin_id', this.params._id)
    return AdminCache.set('admin_doc', Meteor.users.findOne({ _id: this.params._id }))
  }
}
)
