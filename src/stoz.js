var utils = require('./utils.js')
var op = require('./object_path.js')

var PERSISTKEY = '%%PERSIST%%'

if (!Object.is) {
	Object.is = function(x, y) {
		if (x === y) {
			return x !== 0 || 1 / x === 1 / y;
		} else {
			return x !== x && y !== y;
		}
	}
}
function isFunction (f) {
	return f && {}.toString.call(f) === '[object Function]'
}

function isAsync (f) {
	return f && f.constructor.name === 'AsyncFunction'
}

// private variables
var _listeners = {}
var _persistor = null
/**
 * path: {created: Number, lister()}
 */
var locker = {}
module.exports = function (options) {
	// exposed methods
	var me = {}

	if(options && options.persistor) {
		_persistor = options.persistor
	}
	// private methods
	var _publish = function (topic, db) {
		for (var t in _listeners) {
			if (t.indexOf(topic) < 0 && topic.indexOf(t) < 0) continue
			for (var id in _listeners[t]) {
				_listeners[t][id](utils.cloneDeep(op.get(db, t, null)))
			}
		}
	}


	me.subscribe = function (topic, listener) {
		if (!_listeners[topic]) _listeners[topic] = {}

		var sub_id = utils.randomString(20) // subscription id, used to unsubscribe
		_listeners[topic][sub_id] = listener
		// keeping topic in the returned id to remove the listener later
		return topic + '!' + sub_id
	}

	me.unsubscribe = function (sub_id) {
		if (!sub_id) return
		var sub_id_split = sub_id.split('!')
		if (sub_id_split.length !== 2) return // invalid sub_id

		var topic = sub_id_split[0]
		if (!_listeners[topic]) return

		var id = sub_id_split[1]
		delete _listeners[topic][id]
	}

	/**
	 * @return {Object | Promise<Object>}
	 */
	me.get = function (path, options, fetch) {
		options = options || {}
		if (path == null) return Promise.resolve(undefined)

		// simple getter
		if(!options.refetch && op.get(me, path)) {
			return utils.cloneDeep(op.get(me, path))
		}
		// execute fetch
		// convert fetch to promise if its a function
		if (isFunction(fetch)) {
			try {
				fetch = Promise.resolve(fetch())
			} catch (e) {
				fetch = Promise.reject(e)
			}
		} else if (isAsync(fetch)) fetch = fetch()
		else fetch = Promise.resolve(undefined)

		// set lock request
		if(locker[path] && Date.now() - locker[path] < 10 * 1000) {
			return utils.cloneDeep(op.get(me, path))
		}


		locker[path] = Date.now()
		return fetch.then(function (data) {
			me.set(path, data)

			locker[path] = Date.now()
			return data
		})
	}

	me.set = function (path, value) {
		if (path == null) return
		if (value == null) return me.remove(path)

		if(Object.is(value, op.get(me, path))) return
		value = utils.cloneDeep(value)
		op.set(me, path, value)
		_publish(path, me)
	}

	me.remove = function (path) {
		op.del(me, path)
		_publish(path, me)
	}

	me.save = function (key, value) {
		if(!_persistor) return
		if(!value) {
			return _persistor.removeItem(PERSISTKEY + key)
		}
		_persistor.setItem(PERSISTKEY + key, JSON.stringify(value))
	}
	/**
	 * returns null || Object || Promise
	 */
	me.read = function(key) {
		if(!_persistor) return
		// with web
		if(isFunction(_persistor.getItem)){
			var raw = _persistor.getItem(PERSISTKEY + key)
			if(!raw) return
			try {
				return JSON.parse(raw)
			} catch(err){
				console.error(err)
				return
			}
		}
		// with async storage
		return _persistor.getItem(PERSISTKEY + key)
			.then(raw => {
				if(!raw) return
				try {
					return JSON.parse(raw)
				} catch(err){
					console.error(err)
					return
				}
			})
	}

	return me
}
