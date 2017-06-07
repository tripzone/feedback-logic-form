import React, { Component } from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import './App.css';

const testData = [
	{name: 'ali', id:1, pic:'pics/35.jpg'},
	{name: 'mamad taghi moradizadeh', id:2, pic:'pics/39.jpg'},
	{name: 'lucy', id:3, pic:'pics/55.jpg'},
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
			<div className="row">
				<form className="col s12">
					<div className="row">
						<div className="input-field col s10">
							<i className="material-icons prefix">mode_edit</i>
							<textarea id="icon_prefix2" className="materialize-textarea" onChange={this.onChange}></textarea>
							<label for="icon_prefix2">comment</label>
						</div>
					</div>


				</form>

			</div>
		)
	}
	@action onChange = (e) => {
		this.props.user.comment = e.target.value;
	}
}

@observer class FeedbackRadio extends Component {
	render() {
		return(
			<div>
			<div className="collection">
				<a href="#!"><i className="material-icons">thumb_down</i></a>
				<a href="#!"><i className="material-icons">thumbs_up_down</i></a>
				<a href="#!"><i className="material-icons">thumb_up</i></a>
				<a href="#!"><i className="material-icons">thumb_star</i></a>
			</div>
			</div>
		)
	}
	@action onChange = (e) => {

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

	submitForm = () => {
		const selectedUsers = appState.users.data.filter(x=> x.selected === true);
		const payload = selectedUsers.map(x=>{
			return {name: x.name, id: x.id, comment: x.comment}
		})
		console.log(payload)
		this.advanceStage('done');
	}

	allUsersDisplay() {
		return (
			<div className="row">
			{appState.users.data.map(x=> {
			return (
				<div className="" onClick={()=>this.selectItem(x.id)} >
						<div className="col s12 m4 l2">
							<div className="card">
								<div className="card-image">
									<img src={x.pic} />
									<span className="btn-floating halfway-fab waves-effect waves-light red"><i className="material-icons">add</i></span>
								</div>
								<div className={x.selected ? 'user-selected' : 'user-notselected'}>
									<div className="card-content">
										<p className="flow-text">{x.name}</p>
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
		return (
			<div className="row">
			{appState.users.data.map(x => {
				if (x.selected) {
					return (
						<div className='user-feedback'>
							<div className="card horizontal">
								<div className="card-image col s5 m4 l3">
									<img src={x.pic} />
								</div>
								<div className="card-stacked">
									<div className="card-content">
										<p className="flow-text">{x.name}</p>
										<FeedbackInput user={x} />
									</div>
								</div>
							</div>
						</div>

					)
				}
			})}
			</div>
		)
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
					<button className='waves-effect waves-light btn-large' onClick={() => this.submitForm()}>Done</button>
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
