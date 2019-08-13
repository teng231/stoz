// CREDIT: this works is 100% based on https://github.com/mariocasciaro/object-path

var toStr = Object.prototype.toString

var isArray =
	Array.isArray ||
	function (obj) {
		/*istanbul ignore next:cant test*/
		return toStr.call(obj) === '[object Array]'
	}

function isEmpty (value) {
	if (!value) return true
	if (isArray(value) && value.length === 0) return true
	if (typeof value !== 'string') {
		for (var i in value) {
			if (hasOwnProperty(value, i)) return false
		}
		return true
	}
	return false
}

function hasOwnProperty (obj, prop) {
	if (obj == null) return false
	//to handle objects with null prototypes (too edge case?)
	return Object.prototype.hasOwnProperty.call(obj, prop)
}

function getKey (key) {
	var intKey = parseInt(key)
	return intKey.toString() === key ? intKey : key
}

function hasShallowProperty (obj, prop) {
	return (
		(typeof prop === 'number' && Array.isArray(obj)) ||
		hasOwnProperty(obj, prop)
	)
}

function getShallowProperty (obj, prop) {
	if (hasShallowProperty(obj, prop)) return obj[prop]
}

function get (obj, path, defaultValue) {
	if (typeof path === 'number') path = [path]
	if (!path || path.length === 0) return obj
	if (obj == null) return defaultValue
	if (typeof path === 'string') {
		return get(obj, path.split('.'), defaultValue)
	}

	var currentPath = getKey(path[0])
	var nextObj = getShallowProperty(obj, currentPath)
	if (nextObj === void 0) return defaultValue
	if (path.length === 1) return nextObj

	return get(obj[currentPath], path.slice(1), defaultValue)
}

function set (obj, path, value) {
	if (typeof path === 'number') path = [path]
	if (!path || path.length === 0) return obj
	if (typeof path === 'string') {
		return set(obj, path.split('.').map(getKey), value)
	}

	var currentPath = path[0]
	var currentValue = getShallowProperty(obj, currentPath)
	if (path.length === 1) {
		obj[currentPath] = value
		return currentValue
	}

	if (currentValue === void 0) {
		//check if we assume an array
		obj[currentPath] = typeof path[1] === 'number' ? [] : {}
	}

	return set(obj[currentPath], path.slice(1), value)
}

function del (obj, path) {
	if (typeof path === 'number') path = [path]
	if (obj == null) return obj
	if (isEmpty(path)) return obj
	if (typeof path === 'string') return del(obj, path.split('.'))

	var currentPath = getKey(path[0])
	if (!hasShallowProperty(obj, currentPath)) return obj

	if (path.length !== 1) return del(obj[currentPath], path.slice(1))

	if (isArray(obj)) {
		obj.splice(currentPath, 1)
	} else {
		delete obj[currentPath]
	}
	return obj
}

module.exports = { get, set, del, up }

// up returns all paths to its acentors
function up (path) {
	if (!path) return []
	path = path || ''
	var pathsplit = path.split('.')

	var out = []
	var lastparent = ''
	for (var i = 0; i < pathsplit.length; i++) {
		lastparent += '.' + pathsplit[i]
		out.push(lastparent.slice(1)) // remove the leading .
	}
	return out
}