import React, { Component } from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import logo from './logo.svg';
import './App.css';

const testData = [
	{name: 'ali', id:234, pic:'ali.jpg'},
	{name: 'mamad', id:23, pic:'mamad.jpg'}
]

const fetchUsers = new Promise ((resolve, reject) => {
	resolve(testData);
});

class User {
	constructor(id, name, pic) {
		this.id = id;
		this.name = name;
		this.pic = pic;
	}
}

const appState = observable({
	users: {
		@observable loaded: false,
		data: [],
	}
})
appState.loadUser = function(x) {

	// this.users.data.push(x);
}
appState.getAllUsers = function() {
	fetchUsers.then(x=> {
		console.log(x)
		x.forEach(y=> {
			this.users.data.push(new User(y.id, y.name, y.pic))
		})
		this.loaded = true;
	})
	console.log('yap', this)
}

@observer class App extends Component {
	loadUser = (x) => {
		appState.loadUser(x)
	}

	componentWillMount(){
		appState.getAllUsers();
	}
	render() {
		console.log('jam', appState.users);

		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					{appState.users.loaded ?
						appState.users.data.map(x=> {return <li>{x.name}</li>}) :
						'loading'
					}
				</div>
				<button onClick={() => this.loadUser('tom')}>INCREASE</button>
			</div>
		);
	}
}

export default App;
