const newDB = require('./stoz.js')

const localStorageMock = (function() {
	let store = {}
	return {
		getItem: function(key) {
			return store[key] || null
		},
		setItem: function(key, value) {
			store[key] = value.toString()
		},
		removeItem: function(key) {
			delete store[key]
		},
		clear: function() {
			store = {}
		},
	}
})()
var React = {}
const asyncStorageMock = (function() {
	let store = {}
	return {
		getItem: async (key) => {
			return await store[key] || null
		},
		setItem: async (key, value) => {
			return new Promise(()=>{
				store[key] = value.toString()
			})
		},
		removeItem: function(key) {
			delete store[key]
		},
		clear: function() {
			store = {}
		},
	}
})()

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
})
Object.defineProperty(React, 'AsyncStorage', {
	value: asyncStorageMock,
})

const sleep = ms => new Promise(rs => setTimeout(rs, ms))
/* eslint-disable */
describe('db', () => {
	it('can set, get and remove value', async () => {
		const db = newDB()
		db.set(undefined, true) // should ignore
		expect(await db.get(undefined)).toBeUndefined()

		db.set('undefined', undefined)
		expect(await db.get('undefined')).toEqual(undefined)

		db.set('number', 10)
		expect(await db.get('number')).toBe(10)

		db.set('a string', 'a short string')
		expect(await db.get('a string')).toBe('a short string')

		db.set('an+object', { vietnam: 84 })
		expect(await db.get('an+object')).toEqual({ vietnam: 84 })

		db.set('a-function', () => 'hello')
		expect(await db.get('a-function')).toBe(undefined)

		db.remove('number')
		expect(await db.get('number')).toBe(undefined)

		// get, set and remove using dot '.' notation
		db.set('humans', {
			adam: { name: 'adam', age: 45, sons: [{ name: 'zeus', age: 12 }] },
			eva: { name: 'eva', age: 34 },
		})
		expect(await db.get('humans.adam.name')).toBe('adam')
		expect(await db.get('humans.adam.sons.0.name')).toBe('zeus')
		expect(await db.get('humans.eva.age')).toBe(34)

		db.set('humans.adam.father', 'gaia')
		expect(await db.get('humans.adam.father')).toBe('gaia')

		db.set('humans.adam.sons.0.name', 'hercules')
		expect(await db.get('humans.adam.sons.0.name')).toBe('hercules')
	})

	it('me', () => {
		const db = newDB()
		db.set('humans', { adam: 'adam' })
		expect(db.humans.adam).toBe('adam')
		expect(db.adam).toBeUndefined()
	})


	it('do not refetch if data is still new', async () => {
		const db = newDB()
		db.set('humans', { adam: { name: 'adam', age: 45 } })
		let data = await db.get('humans.adam.name', { refetch: true }, () => 'adam2')
		expect(data).toBe('adam2') // data is not expired yet
	})

	it('fetch new data when data is expired', async () => {
		const db = newDB()
		db.set('humans', { adam: { name: 'adam', age: 45 } })
		let data = await db.get('humans.adam.name', { refetch: false }, () => 'adam2')
		expect(data).toBe('adam') // data is not expired yet
	})

	it('subscribe and unsubcribe: simple', () => {
		const db = newDB()
		db.set('humans', {
			adam: { name: 'adam', age: 45, sons: [{ name: 'zeus', age: 12 }] },
			eva: { name: 'eva', age: 34 },
		})

		let called = 0
		let wid = db.subscribe('humans.adam.age', _ => called++)

		db.set('humans.adam.age', 13)
		expect(called).toBe(1)
		db.unsubscribe(wid)

		// should not call after unwatch
		db.set('humans.adam.age', 14)
		expect(called).toBe(1)
	})

	it('subscribe and unsubscribe: complex', () => {
		const db = newDB()
		db.set('humans', {
			adam: { name: 'adam', age: 45, sons: [{ name: 'zeus', age: 12 }] },
			eva: { name: 'eva', age: 34 },
		})

		let called = 0
		let wid = db.subscribe('humans.adam', _ => called++)
		db.set('humans.eva.name', 'hera') // no fire
		db.set('humans', { adam: { age: 13 } }) // fire
		expect(called).toBe(1)
		db.set('humans', { adam: { age: 13, name: 'hercules' } }) // fire
		db.set('humans.adam.name', 'hercules') // dont fire, the data haven't changed yet
		db.set('humans.adam.name', 'hercules2') // fire
		expect(called).toBe(3)
		db.unsubscribe(wid)

		// child topic should be notified when parent is modified
		called = 0
		db.set('humans', { adam: { name: 'adam', age: 45 } })
		wid = db.subscribe('humans.adam.name', payload => called++)
		db.set('humans.adam', { age: 10 }) // fire
		expect(called).toBe(1)
		db.unsubscribe(wid)
		called = 0
		db.set('humans', { adam: { sons: [{ name: 'zeus', age: 12 }] } })
		wid = db.subscribe('humans.adam.sons.0.name', payload => called++)
		db.set('humans.adam', { age: 10 }) // fire
		expect(called).toBe(1)
		db.unsubscribe(wid)
	})

	it('subscribe prop in object', () => {
		const db = newDB()
		db.set('humans', {
			adam: 100,
			eva: 200,
		})
		var adam = 100
		var adam_of_list = 100
		db.subscribe('humans.adam', _a => (adam = _a))
		db.subscribe('humans', h => (adam_of_list = h.adam))
		db.set('humans', {
			adam: 3000,
			eva: 200,
		})
		expect(adam).toBe(3000)
		// expect(adam_of_list).toBe(3000)
	})


	it('save data to ls', async () => {
		var db = newDB({persistor: window.localStorage})
		// set number
		db.save('abc', 100)
		expect(db.read('abc')).toBe(100)
		// remove item
		db.save('abc', null)
		expect(db.read('abc')).toBeUndefined
		// set string
		db.save('abc', 'consequense')
		expect(db.read('abc')).toBe('consequense')
		// set object
		db.save('abc', {a:1})
		expect(db.read('abc').a).toBe(1)
		// set array
		db.save('abc', ['1', 2])
		expect(db.read('abc')[0]).toBe('1')


		var db = newDB({persistor: React.AsyncStorage})
		db.save('abc', 100)
		db.read('abc').then(v => {
			expect(v).toBe(100)
		})
		// remove item
		db.save('abc', null)
		let value = await db.read('abc')
		expect(value).toBeUndefined
	})
})
