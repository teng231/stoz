const {cloneDeep} = require('./utils.js')
const {Event} = require('./event.js')
class Store extends Event {
	constructor() {
		super()
		this._db
		this._modules
		this._initState = {}
		this._expired = {}
	}
	// ------------------- getters---------------------
	get modules() {
		return this._modules
	}

	get db() {
		return cloneDeep(this._db)
	}

	get expireTime() {
		return this._expired
	}
	// ------------------- private func ------------------

	_setExpired(key, time) {
		if(isNaN(time) || time < 0) return
		this.setTimeout(() => {
			this._expired[key] = true
		}, time)
	}

	// ----------------public func------------------------
	initStore(configs) {
		this._initState = Object.assign({}, configs.db || {})
		this._db = configs.db || {}
		this._modules = configs.modules
	}

	getState(key) {
		if(this._db[key]) throw Error(`key ${key} is not registered`)
		return this._db[key]
	}

	setState(key, value, option = {}) {
		if(this._db[key]) throw Error(`key ${key} is not registered`)
		// option time_expired (ms)
		if(option && option.time_expired) this._setExpired(key, time)
		this._db[key] = value
		this._publish(key, this._db[key])
		return this._db[key]
	}
}

exports.Store = Store