import Store from '../../index.js'
import axios from 'axios'
var stoz = new Store()

let initStates = () => ({
	user:{},
	conversation:{}
})
let modules = {}

stoz.initStore({
	db: initStates(),
	modules: modules
})


modules.getEmployees = async ({name}) => {
	let users = stoz.getState('user')
	if(users.employees) return users.employees

	let resp = await axios.get(`http://dummy.restapiexample.com/api/v1/${name}`)

	if(resp.status === 200) {
		stoz.setState('user', {...users, employees: resp.data}, {expr})
	}
	return resp
}

window.db = stoz.getState('*')

export default stoz