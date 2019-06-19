class Event {
	constructor() {
		this._stackEvent = {}
	}
	get stackEvent() {
		return this._stackEvent
	}
	/**
	 *
	 * @param {String} event
	 * @param {Callback} listener
	 */
	subscribe(event, listener){
		if(!this._stackEvent.hasOwnProperty(event)) this._stackEvent[event] = []
		var index = this._stackEvent[event].push(listener) - 1
		return {
			unsubscribe(){
				this._stackEvent[event].splice(index, 1)
			}
		}
	}
	_publish(event, payload) {
		(this._stackEvent[event] || []).forEach(listener => listener(payload))
	}
}
exports.Event = Event