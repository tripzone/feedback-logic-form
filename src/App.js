import React, { Component } from 'react';
import {observable, action} from 'mobx';
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
	@observable comment = '';

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
	}),
	stage: 'selection'
})
appState.getAllUsers = function() {
	fetchUsers.then(x=> {
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
appState.advanceStage = function(nextStage) {
	this.stage = nextStage;
}

@observer class FeedbackInput extends Component {
	@observable input = '';
	render() {
		return(
			<input id='comment' className='user-feedback-lower-input materialize-textarea' onChange={this.onChange}  />
		)
	}
	@action onChange = (e) => {
		this.props.user.comment = e.target.value;
	}

}

@observer class App extends Component {
	advanceStage = (x) => {
		appState.advanceStage(x)
	}
	selectItem = (x) =>{
		appState.selectUser(x);
	}
	componentWillMount(){
		appState.getAllUsers();
	}

	allUsersDisplay() {
		return (
			<div className="row">
			{appState.users.data.map(x=> {
			return (
				<div onClick={()=>this.selectItem(x.id)} >
						<div className="col s12 m4 l2">
							<div className="card">
								<div className="card-image">
									<img src={x.pic} />
									<span className="btn-floating halfway-fab waves-effect waves-light red"><i className="material-icons">add</i></span>

								</div>
								<div className={x.selected ? 'user-selected' : 'user-notselected'}>
									<div className="card-content">
										{x.name}

									</div>
								</div>
							</div>
						</div>
				</div>
			)
		})}
		</div>
	)}

	selectedUsersFeedback() {
		// const selectedUsers = (appState.users.data.filter(x=> {return x.selected === true}))
		return appState.users.data.map(x => {
			if (x.selected) {
				return (
					<div className='user-feedback'>




						<div className='user-feedback-name'>{x.name}</div>
						<div className='user-feedback-lower'>
							<img className = 'user-feedback-lower-pic'src={x.pic}></img>
							<FeedbackInput user={x} />
						</div>
					</div>
				)
			}
		});
	}

	render() {
		if (appState.stage === 'selection') {
			return (
				<div>

					<div className='user-select-canvas'>
						{
							!appState.users.loaded ? 'loading...' : this.allUsersDisplay()
						}
					</div>
					<button className='waves-effect waves-light btn-large' onClick={() => this.advanceStage('feedback')}>Select</button>
				</div>
			);
		} else if (appState.stage === 'feedback') {
			return(
				<div>
					<div  className='user-feedback-canvas'>
						{
							this.selectedUsersFeedback()
						}
					</div>
					<button onClick={() => this.advanceStage('done')}>Done</button>
				</div>
			)
		} else if (appState.stage === 'done') {
			return(
				<div>
					{appState.users.data.map(x=> x.comment)}
				</div>
			)
		}

	}
}

export default App;
