const createStore = require('../')

test('mutates the store when there is a change', () => {
  let store = createStore()

  store.set({a: 1})
  let firstStore = store.get()

  store.set({a: 2})
  let secondStore = store.get()

  expect(secondStore.a).toBe(2)
  expect(firstStore).not.toBe(secondStore)
})

test('mutates the store for changes deep in the store', () => {
  let store = createStore()

  store.set({a: {b: {c: 1}}})
  let firstStore = store.get()

  store.set({a: {b: {c: 2}}})
  let secondStore = store.get()

  expect(secondStore.a.b.c).toBe(2)
  expect(firstStore.a.b.c).not.toBe(secondStore.a.b.c)
  expect(firstStore.a.b).not.toBe(secondStore.a.b)
  expect(firstStore.a).not.toBe(secondStore.a)
  expect(firstStore).not.toBe(secondStore)
})

test('doesnt affect non changed branches in store tree', () => {
  let store = createStore()

  store.set({
    a: {
      b: {
        c: 1
      },
      d: {
        e: 1
      }
    }
  })
  let firstStore = store.get()

  store.set({
    a: {
      d: {
        e: 2
      }
    }
  })
  let secondStore = store.get()

  expect(secondStore.a.d.e).toBe(2)
  expect(firstStore.a.d.e).not.toBe(secondStore.a.d.e)
  expect(firstStore.a.d).not.toBe(secondStore.a.d)
  expect(firstStore.a.b).toBe(secondStore.a.b)
  expect(firstStore.a.b.c).toBe(secondStore.a.b.c)
})

test('freezes the store by default', () => {
  let store = createStore()

  store.set({a: {b: 2}})
  let value = store.get()

  expect(Object.isFrozen(value)).toBeTruthy()
  expect(Object.isFrozen(value.a)).toBeTruthy()
})

test('freezing can be disabled', () => {
  let store = createStore({ shouldFreeze: false })

  store.set({a: {b: 2}})
  let value = store.get()

  expect(!Object.isFrozen(value)).toBeTruthy()
  expect(!Object.isFrozen(value.a)).toBeTruthy()
})

test('emits change events whenever the store changes', () => {
  let store = createStore()

  let fn = jest.fn()
  store.on('change', fn)

  store.set({a: 1})

  expect(fn).toHaveBeenCalled()
})

test('doesnt error on null values', () => {
  let store = createStore()

  expect(() => store.set({a: {b: null, c: 1}})).not.toThrow()
})

test('works with arrays', () => {
  let store = createStore()
  store.set({a: [1, 2, 3]})
  expect(Array.isArray(store.get().a)).toBeTruthy()
})

test('works with empty objects', () => {
  let store = createStore()
  store.set({ a: {} })
  expect(store.get().a).toEqual({})
})