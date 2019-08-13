const f = () => new Promise(r => {
	setTimeout(() => r('done1'), 1000)
})
let lock = {}

function x(path, fn) {
	// set lock request
	if(locker[path]) {
		return utils.cloneDeep(op.get(me, path))
	}

}