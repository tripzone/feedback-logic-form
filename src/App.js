import React, { Component } from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import './App.css';

const testData = [
	{name: 'ali', id:1, pic:'pics/35.jpg'},
	{name: 'mamad', id:2, pic:'pics/39.jpg'},
	{name: 'mamad', id:3, pic:'pics/55.jpg'},
]

const fetchUsers = new Promise ((resolve, reject) => {
	setTimeout(	() => {resolve(testData)}, 200)
});
class User {
	@observable selected = false;

	constructor(id, name, pic) {
		this.id = id;
		this.name = name;
		this.pic = pic;
	}
}
const appState = observable({
	users: observable({
		loaded: false,
		data: [],
	})
})
appState.getAllUsers = function() {
	fetchUsers.then(x=> {
		console.log(x)
		x.forEach(y => {
			this.users.data.push(new User(y.id, y.name, y.pic))
		})
		this.users.loaded = true;
	})
}
appState.selectUser = function(id) {
	const userIndex = this.users.data.findIndex(q => q.id === id);
	this.users.data[userIndex].selected = !this.users.data[userIndex].selected;
}

@observer class App extends Component {
	clickAction = (x) => {
		appState.getAllUsers()
	}
	selectItem = (x) =>{
		appState.selectUser(x);
	}
	componentWillMount(){
		appState.getAllUsers();
	}

	usersDisplay() {
		return appState.users.data.map(x=> {
			return (
				<div onClick={()=>this.selectItem(x.id)} className={x.selected ? 'user-selected' : 'user-notselected'}>
					<img src={x.pic}></img>
					{x.name}
				</div>
			)
		})
	}

	render() {
		return (
			<div>
				{
					appState.users.loaded ? this.usersDisplay() : 'loading...'
				}
				<button onClick={() => this.clickAction('tom')}>INCREASE</button>
			</div>
		);
	}
}

export default App;
