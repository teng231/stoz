const op = require('./object_path.js')

describe('object path', () => {
	it('test up', () => {
		var out = op.up('adam.age')
		expect(out).toEqual(['adam', 'adam.age'])

		out = op.up('adam.sons.0.name')
		expect(out).toEqual([
			'adam',
			'adam.sons',
			'adam.sons.0',
			'adam.sons.0.name',
		])

		out = op.up('')
		expect(out).toEqual([])

		out = op.up(undefined)
		expect(out).toEqual([])
	})
	it('op test', () => {
		var a ={x:1}
		expect(op.get(a, 'x')).toBe(1)
		expect(op.get(a, '.x')).toBe(undefined)
	})
})