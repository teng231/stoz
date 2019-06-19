class Event {
	constructor() {
		this._stackEvent = {}
	}
	get stackEvent() {
		return this._stackEvent
	}
	subscribe(event, listener){
		if(!this._stackEvent.hasOwnProperty(event)) return this._stackEvent[event] = []
		var index = this._stackEvent[event].push(listener) -1
		return {
			unsubscribe(){
				this._stackEvent[event].splice(index, 1)
			}
		}
	}
	publish(event, payload) {
		(this._stackEvent[event] || []).forEach(listener => listener(payload))
	}
}
exports.Event = Event