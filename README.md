# simmutable

A simple immutable store.

## How to use

    const createStore = require('simmutable')

    const store = createStore()

    store.get() // {}

    store.set({a: 1})
    store.get() // {a: 1}

    store.clear()
    store.get() // {}

### Api

#### config

Currently there is only one config variable

`store.config.shouldFreeze = true`

By default the store will ensure that all objects and nested objects are frozen in the store. Turning this off will not automatically unfreeze the store. It is suggested that you only change this prior to doing any work with the store.

#### get()

`store.get()` will return the current value of the store.

#### set()
`store.set(valueToMerge)` Will merge the object passed in, into the current store. If the `valueToMerge` won't actually change any value in the store, no changes are actually made to the store. The change event will still be emitted. When `valueToMerge` has n nested objects, it will determine what values actually changed, and ensure only those values, and their parents all the way up to the root are changed. This makes it much easier to determine from the root whether or not any changes were actually made to the store.

#### clear()
`store.clear()` will reset the store to it's initial value of `{}`. This will emit a change event.

#### EventEmitter
The store implements the prototype of an event emitter and will emit a change event any time the store is changed either by calling `clear()` or `set()`
