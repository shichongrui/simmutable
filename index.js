var EventEmitter = require('eventemitter3')

var storeValue = {}

var emitter = new EventEmitter()

const store = Object.assign({
  config: {
    shouldFreeze: true
  },
  set (newValue) {
    storeValue = merge(storeValue, newValue)
    this.emit('change')
  },
  get () {
    return storeValue
  },
  clear () {
    storeValue = {}
    this.emit('change')
  }
}, Object.getPrototypeOf(emitter))

function merge (oldObject, newObject) {
  var returnValue
  if (oldObject) {
    var changes = Object.keys(newObject).reduce((memo, key) => {
      if (typeof newObject[key] === 'object') {
        var mergeResult = merge(oldObject[key], newObject[key])
        if (Object.keys(mergeResult).length > 0) {
          memo[key] = mergeResult
        }
      } else {
        if (oldObject[key] !== newObject[key]) {
          memo[key] = newObject[key]
        }
      }
      return memo
    }, {})
    if (Object.keys(changes).length > 0) {
      returnValue = Object.assign({}, oldObject, changes)
    } else {
      returnValue = oldObject
    }
  } else {
    returnValue = Object.assign({}, newObject)
  }
  return store.config.shouldFreeze ? Object.freeze(returnValue) : returnValue
}

module.exports = store
