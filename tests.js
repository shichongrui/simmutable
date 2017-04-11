var test = require('tape')
var createStore = require('./index')

test('mutates the store when there is a change', function (t) {
  let store = createStore()

  store.set({a: 1})
  var firstStore = store.get()

  store.set({a: 2})
  var secondStore = store.get()

  t.equal(secondStore.a, 2)
  t.notEqual(firstStore, secondStore)
  t.end()
})

test('mutates the store for changes deep in the store', function (t) {
  let store = createStore()

  store.set({a: {b: {c: 1}}})
  var firstStore = store.get()

  store.set({a: {b: {c: 2}}})
  var secondStore = store.get()

  t.equal(secondStore.a.b.c, 2)
  t.notEqual(firstStore.a.b.c, secondStore.a.b.c)
  t.notEqual(firstStore.a.b, secondStore.a.b)
  t.notEqual(firstStore.a, secondStore.a)
  t.notEqual(firstStore, secondStore)
  t.end()
})

test('doesnt affect non changed branches in store tree', function (t) {
  let store = createStore()

  store.set({a: {b: {c: 1}, d: {e: 1}}})
  var firstStore = store.get()

  store.set({a: {d: {e: 2}}})
  var secondStore = store.get()

  t.equal(secondStore.a.d.e, 2)
  t.notEqual(firstStore.a.d.e, secondStore.a.d.e)
  t.notEqual(firstStore.a.d, secondStore.a.d)
  t.equal(firstStore.a.b, secondStore.a.b)
  t.equal(firstStore.a.b.c, secondStore.a.b.c)
  t.end()
})

test('freezes the store by default', function (t) {
  let store = createStore()

  store.set({a: {b: 2}})
  var value = store.get()

  t.ok(Object.isFrozen(value))
  t.ok(Object.isFrozen(value.a))
  t.end()
})

test('freezing can be disabled', function (t) {
  let store = createStore({ shouldFreeze: false })

  store.set({a: {b: 2}})
  var value = store.get()

  t.ok(!Object.isFrozen(value))
  t.ok(!Object.isFrozen(value.a))
  store.config.shouldFreeze = true
  t.end()
})

test('emits change events whenever the store changes', function (t) {
  let store = createStore()

  var changeEmitted = false
  store.on('change', function () {
    changeEmitted = true
  })

  store.set({a: 1})

  t.ok(changeEmitted)
  t.end()
})

test('doesnt error on null values', function (t) {
  t.doesNotThrow(function () {
    let store = createStore()

    store.set({a: {b: null, c: 1}})
  })
  t.end()
})

test('works with arrays', function (t) {
  let store = createStore()
  store.set({a: [1, 2, 3]})
  t.ok(Array.isArray(store.get().a))
  t.end()
})
