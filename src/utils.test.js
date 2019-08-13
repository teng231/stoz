const { cloneDeep, randomString } = require('../src/utils')

describe('utils', () => {
	it('cloneDeep', () => {
		var test1 = { a: { b: 1 } }
		var test2 = cloneDeep(test1)
		test2.a.b = 2
		expect(test1.a.b).toBe(1)

		expect(cloneDeep(() => {})).toBe(undefined)
	})

	it('randomString', () => {
		var str = randomString(10)
		expect(typeof str).toBe('string')
		expect(str.length).toBe(10)
	})
})