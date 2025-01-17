/* global Roles Accounts */
import {Meteor} from 'meteor/meteor'
import {check, Match} from 'meteor/check'
import { AdminConfig } from '../both/AdminConfig'
import { adminCollectionObject } from '../both/utils'

Meteor.methods({
  adminInsertDoc (doc, collection) {
    check(arguments, [Match.Any])
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      this.unblock()
      const result = adminCollectionObject(collection).insert(doc)

      return result
    }
  },

  adminUpdateDoc (modifier, collection, _id) {
    check(arguments, [Match.Any])
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      this.unblock()
      const result = adminCollectionObject(collection).update({ _id }, modifier)
      return result
    }
  },

  adminRemoveDoc (collection, _id) {
    check(arguments, [Match.Any])
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      if (collection === 'Users') {
        return Meteor.users.remove({ _id })
      } else {
        // global[collection].remove {_id:_id}
        return adminCollectionObject(collection).remove({ _id })
      }
    }
  },

  adminNewUser (doc) {
    check(arguments, [Match.Any])
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      const emails = doc.email.split(',')
      return _.each(emails, function (email) {
        const user = {}
        user.email = email
        if (!doc.chooseOwnPassword) {
          user.password = doc.password
        }

        const _id = Accounts.createUser(user)
        const config = AdminConfig.get()
        if (doc.sendPassword && (config.fromEmail != null)) {
          Email.send({
            to: user.email,
            from: config.fromEmail,
            subject: 'Your account has been created',
            html: `You've just had an account created for ${Meteor.absoluteUrl()} with password ${doc.password}`
          })
        }

        if (!doc.sendPassword) {
          return Accounts.sendEnrollmentEmail(_id)
        }
      })
    }
  },

  adminUpdateUser (modifier, _id) {
    check(arguments, [Match.Any])
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      this.unblock()
      const result = Meteor.users.update({ _id }, modifier)
      return result
    }
  },

  adminSendResetPasswordEmail (doc) {
    check(arguments, [Match.Any])
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      console.log(`Changing password for user ${doc._id}`)
      return Accounts.sendResetPasswordEmail(doc._id)
    }
  },

  adminChangePassword (doc) {
    check(arguments, [Match.Any])
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      console.log(`Changing password for user ${doc._id}`)
      Accounts.setPassword(doc._id, doc.password)
      return { label: 'Email user their new password' }
    }
  },

  adminCheckAdmin () {
    check(arguments, [Match.Any])
    const user = Meteor.users.findOne({ _id: this.userId })
    const config = AdminConfig.get()
    if (this.userId && !Roles.userIsInRole(this.userId, ['admin']) && (user.emails.length > 0)) {
      let adminEmails
      const email = user.emails[0].address
      if (typeof Meteor.settings.adminEmails !== 'undefined') {
        ({ adminEmails } = Meteor.settings)
        if (adminEmails.indexOf(email) > -1) {
          console.log(`Adding admin user: ${email}`)
          return Roles.addUsersToRoles(this.userId, ['admin'], Roles.GLOBAL_GROUP)
        }
      } else if (typeof config.adminEmails === 'object') {
        ({ adminEmails } = config)
        if (adminEmails.indexOf(email) > -1) {
          console.log(`Adding admin user: ${email}`)
          return Roles.addUsersToRoles(this.userId, ['admin'], Roles.GLOBAL_GROUP)
        }
      } else if (this.userId === Meteor.users.findOne({}, { sort: { createdAt: 1 } })._id) {
        console.log(`Making first user admin: ${email}`)
        return Roles.addUsersToRoles(this.userId, ['admin'])
      }
    }
  },

  adminAddUserToRole (_id, role) {
    check(arguments, [Match.Any])
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      return Roles.addUsersToRoles(_id, role, Roles.GLOBAL_GROUP)
    }
  },

  adminRemoveUserToRole (_id, role) {
    check(arguments, [Match.Any])
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      return Roles.removeUsersFromRoles(_id, role, Roles.GLOBAL_GROUP)
    }
  },

  adminSetCollectionSort (collection, _sort) {
    check(arguments, [Match.Any])
    return global.AdminPages[collection].set({
      sort: _sort })
  }
})
