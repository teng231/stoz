import React from 'react';
import logo from './logo.svg';
import './App.css';
import store from './store.js'
export default class extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			users: []
		}
	}
	async componentDidMount() {
		let users =	await store.getEmployees({name: 'employees'})
		this.setState({users})
	}
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.js</code> and save to reload.
					</p>
					{this.state.users.length}
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
				</header>
			</div>
		)
	}
}
