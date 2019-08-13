import axios from 'axios'
import stoz from 'stoz'
const db = stoz({persistor: window.localStorage})
const store = {}

store.getEmployees = async ({name}) =>
	db.get('employees', true, async () => {
		let resp = await axios.get(`http://dummy.restapiexample.com/api/v1/${name}?limit=100`)
		return resp.data
	})

window.db = db
export default store