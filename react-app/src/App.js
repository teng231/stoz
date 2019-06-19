import React from 'react';
import logo from './logo.svg';
import './App.css';
import stoz from './store.js'

export default class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			employees: []
		}
	}
	async componentDidMount() {
		stoz.subscribe('user', (users) => {
			this.setState({employees: users.employees})
		})
		let employees = await stoz.modules.getEmployees({name: 'employees'})
		console.log(employees)
	}
	render () {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<code>{JSON.stringify(this.state.employees)}</code>
				</header>
			</div>
		)
	}
}
