import React, { Component } from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import fetch from 'isomorphic-fetch'
import './App.css';

const serverLink = 'http://localhost:5011';
const picPath = serverLink+'/public/'


const fetchUsers = (apiLink) => {
	return new Promise ((resolve, reject) => {
		fetch(serverLink+apiLink, {
			method: 'GET',
		}).then((x)=>resolve(x.json()))
			.catch((x)=>reject(null))
	});
}

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
appState.getAllUsers = function(school) {
	fetchUsers(school).then(x=> {
		x.forEach(y => {
			const picFile = y.pic ? picPath+y.pic : picPath+'placeholder.jpg';
			this.users.data.push(new User(y.id, y.name, picFile))
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
	window.scrollTo(0, 0);
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
		appState.advanceStage(x);
	}
	selectItem = (x) =>{
		appState.selectUser(x);
	}
	componentWillMount(){
		const pathName = window.location.pathname
		if ((pathName === '/ivey') || (pathName === '/queens') || (pathName === '/workshop')) {
			appState.getAllUsers(pathName);
		}
	}

	submitForm = () => {
		const pathName = window.location.pathname.replace('/','')
		const selectedUsers = appState.users.data.filter(x=> x.selected === true);
		const payload = selectedUsers.map(x=>{
			return {name: x.name, id: x.id, comment: x.comment}
		})
		fetch(serverLink+'/feedback', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'collection': pathName,
			},
			body: JSON.stringify(payload)
		}).then((x)=>console.log('good',x)).catch((x)=>console.log('bad',x))
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
										<p className="h5">{x.name}</p>
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
