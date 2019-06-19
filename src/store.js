const {cloneDeep} = require('./utils.js')
const {Event} = require('./event.js')
class Store extends Event {
	constructor() {
		super()
		this._db = {}
		this._modules = {}
		this._initState = {}
		this._updated = {}
	}
	// ------------------- getters---------------------
	get modules() {
		return this._modules
	}

	get db() {
		return cloneDeep(this._db)
	}

	get updated() {
		return this._updated
	}
	// ------------------- private func ------------------

	_setUpdated(key, time) {
		this._updated[key] = Date.now()
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
		// option expired (ms)
		if(option && option.expired) this._setExpired(key, option.expired)
		this._db[key] = value
		this._publish(key, this._db[key])
		return this._db[key]
	}
}

module.exports = Store