import { AdminConfig } from './AdminConfig'
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
this.adminCollectionObject = function (collection) {
  const config = AdminConfig.get()
  if ((typeof config.collections[collection] !== 'undefined') && (typeof config.collections[collection].collectionObject !== 'undefined')) {
    return config.collections[collection].collectionObject
  } else {
    return lookup(collection)
  }
}

this.adminCallback = function (name, args, callback) {
  let stop = false
  const config = AdminConfig.get()

  if (typeof __guard__(config.callbacks, x => x[name]) === 'function') {
    stop = config.callbacks[name](...Array.from(args || [])) === false
  }
  if (typeof callback === 'function') {
    if (!stop) { return callback(...Array.from(args || [])) }
  }
}

this.lookup = function (obj, root, required) {
  if (required == null) { required = true }
  if (typeof root === 'undefined') {
    root = Meteor.isServer ? global : window
  }
  if (typeof obj === 'string') {
    let ref = root
    const arr = obj.split('.')
    while (arr.length && (ref = ref[arr.shift()])) { continue }
    if (!ref && required) {
      throw new Error(obj + ' is not in the ' + root.toString())
    } else {
      return ref
    }
  }
  return obj
}

this.parseID = function (id) {
  if (typeof id === 'string') {
    if (id.indexOf('ObjectID') > -1) {
      return new Mongo.ObjectID(id.slice(id.indexOf('"') + 1, id.lastIndexOf('"')))
    } else {
      return id
    }
  } else {
    return id
  }
}

this.parseIDs = ids =>
  _.map(ids, id => parseID(id))

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}