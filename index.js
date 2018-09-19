const EventEmitter = require('eventemitter3')

function merge (oldObject, newObject, shouldFreeze) {
  debugger
  let returnValue
  if (oldObject && newObject) {
    let changes = Object.keys(newObject).reduce((memo, key) => {
      if (newObject[key] !== null && !Array.isArray(newObject[key]) && typeof newObject[key] === 'object') {
        let mergeResult = merge(oldObject[key], newObject[key], shouldFreeze)
        memo[key] = mergeResult
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
  return shouldFreeze ? Object.freeze(returnValue) : returnValue
}

module.exports = function (config) {
  config = config || { shouldFreeze: true }
  let emitter = new EventEmitter()

  const store = Object.assign({
    config: config,
    storeValue: {},
    set (newValue) {
      this.storeValue = merge(this.storeValue, newValue, this.config.shouldFreeze)
      this.emit('change')
    },
    get () {
      return this.storeValue
    },
    clear () {
      this.storeValue = {}
      this.emit('change')
    }
  }, Object.getPrototypeOf(emitter))

  return store
}
