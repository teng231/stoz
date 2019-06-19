const {cloneDeep} = require('./utils.js')
const {Event} = require('./event.js')
class Store extends Event {
	constructor() {
		super()
		this._db = {}
		this._modules = {}
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
	/**
	 *
	 * @param {db:Object, modules: {[String]: Function} configs
	 */
	initStore(configs) {
		if(configs.db) {
			this._initState = Object.assign({}, configs.db || {})
			this._db = configs.db || {}
		}
		if(configs.modules) {
			this._modules = configs.modules
			for(let name in this._modules) {
				this[name] = this._modules[name]
			}
		}
	}
	getState(key) {
		if(key === '*') return this._db
		if(!this._db.hasOwnProperty(key)) throw Error(`key ${key} is not registered`)
		return this._db[key]
	}

	setState(key, value, option = {}) {
		if(!this._db.hasOwnProperty(key)) throw Error(`key ${key} is not registered`)
		// option time_expired (ms)
		if(option && option.time_expired) this._setExpired(key, option.time_expired)
		this._db[key] = value
		this._publish(key, this._db[key])
		return this._db[key]
	}
}

module.exports = Store