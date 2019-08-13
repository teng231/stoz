function isPrimitive (test) {
	return test !== Object(test)
}

function cloneDeep (p) {
	if (isPrimitive(p)) return p
	var s = JSON.stringify(p) // JSON.stringify(()=>"") returns undefined
	if (s === undefined) return
	return JSON.parse(s)
}

function randomString (len) {
	var str = ''
	var asciiKey
	for (var i = 0; i < len; i++) {
		asciiKey = Math.floor(Math.random() * 25 + 97)
		str += String.fromCharCode(asciiKey)
	}
	return str
}

module.exports = {
	cloneDeep: cloneDeep,
	randomString: randomString,
}