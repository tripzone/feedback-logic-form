import React, { Component } from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import fetch from 'isomorphic-fetch';
import classNames from 'classnames';
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
	@observable rating = '';
	constructor(id, name, pic) {
		this.id = id;
		this.name = name;
		this.pic = pic;
	}
}
const appState = observable({
	fields: observable({
		loaded: false,
		data: [],
	}),
	stage: 'user',
	userName: '',
	userEmail: '',
	userPosition: ''
})
appState.getAllUsers = function(school) {
	fetchUsers(school).then(x=> {
		x.forEach(y => {
			const picFile = y.pic ? picPath+y.pic : picPath+'placeholder.jpg';
			this.fields.data.push(new User(y.id, y.name, picFile))
		})
		this.fields.loaded = true;
	})
}
appState.selectUser = function(id) {
	const userIndex = this.fields.data.findIndex(q => q.id === id);
	this.fields.data[userIndex].selected = !this.fields.data[userIndex].selected;
}
appState.advanceStage = function(nextStage) {
	this.stage = nextStage;
	window.scrollTo(0, 0);
}

class UserInput extends Component {
	render() {
		return(
			<div>
				<div className="row">
					<div className="input-field">
						<input id="name" type="text" className="validate" onChange={this.onChangeName}/>
						<label for="name">Name</label>
					</div>
				</div>
				<div className="row">
					<div className="input-field">
						<input id="email" type="email" className="validate" onChange={this.onChangeEmail}/>
						<label for="email">Email</label>
					</div>
				</div>
				<div className="row">
					<select className="browser-default" onChange={this.onChangePosition}>
						<option value="" disabled selected>Position</option>
						<option value="BTA">BTA</option>
						<option value="C">C</option>
						<option value="SC">SC</option>
						<option value="M">M</option>
						<option value="SM">SM</option>
						<option value="P">P</option>
					</select>
				</div>
			</div>

		)
	}
	@action onChangeName = (e) => {
		appState.userName = e.target.value;
	}
	@action onChangeEmail = (e) => {
		appState.userEmail =  e.target.value;

	}
	@action onChangePosition = (e) => {
		appState.userPosition =  e.target.value;
	}
}

class FeedbackInput extends Component {
	render() {
		return(
			<div className="row">
				<form className="col s12">
					<div className="input-field col s10">
						<i className="material-icons prefix">mode_edit</i>
						<textarea id="icon_prefix2" className="materialize-textarea" onChange={this.onChange}></textarea>
						<label for="icon_prefix2">comment</label>
					</div>
				</form>
			</div>
		)
	}
	@action onChange = (e) => {
		this.props.user.comment = e.target.value;
	}
}

@observer class FeedbackRating extends Component {
	render() {
		var noIconStyle = classNames({
			'feedback-rating-icon': true,
			'active-icon': this.props.user.rating === 'no',
		});
		var sosoIconStyle = classNames({
			'feedback-rating-icon': true,
			'active-icon': this.props.user.rating === 'soso',
		});
		var yesIconStyle = classNames({
			'feedback-rating-icon': true,
			'active-icon': this.props.user.rating === 'yes',
		});
		var greatIconStyle = classNames({
			'feedback-rating-icon': true,
			'active-icon': this.props.user.rating === 'great',
		});
		console.log('noIconStyle');
		return(
			<div>
				<div className="feedback-rating">
					<div className="flow-text col s12 m3"><h6>Good fit for Deloitte</h6></div>
					<div className="feedback-rating-icons col s12 m9">
						<div className={noIconStyle} onClick={()=> this.onChange('no')}>
							No
							<br/><i className="material-icons material-icons-feedback">thumb_down</i>
						</div>
						<div className={sosoIconStyle} onClick={()=> this.onChange('soso')}>
							so-so
							<br/><i className="material-icons material-icons-feedback" >thumbs_up_down</i>
						</div>
						<div className={yesIconStyle} onClick={()=> this.onChange('yes')}>
							Yes
							<br/><i className="material-icons material-icons-feedback" >thumb_up</i>
						</div>
						<div className={greatIconStyle} onClick={()=> this.onChange('great')}>
							Great
							<br/><i className="material-icons material-icons-feedback" >star</i>
						</div>
					</div>
				</div>
			</div>

		)
	}
	@action onChange = (x) => {console.log('here is', x); this.props.user.rating = x}
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
		} else {
			this.advanceStage('invalidLink');
		}
	}

	submitForm = () => {
		const pathName = window.location.pathname.replace('/','')
		const selectedUsers = appState.fields.data.filter(x=> x.selected === true);
		const payload = selectedUsers.map(x=>{
			return {name: x.name, id: x.id, comment: x.comment, rating: x.rating, userName: appState.userName, userEmail:appState.userEmail, userPosition: appState.userPosition}
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
			{appState.fields.data.map(x=> {
			return (
				<div className="" onClick={()=>this.selectItem(x.id)} >
						<div className="col s12 m4 l2">
							<div className="card card-all-users">
								<div className="card-image card-image-all-users">
									<img src={x.pic} />
									<span className="btn-floating halfway-fab waves-effect waves-light red">
										<i className="material-icons">{x.selected ? 'done' : 'add'}</i>
									</span>
								</div>
								<div className={x.selected ? 'user-selected' : 'user-notselected'}>
									<div className="card-content card-content-all-users">
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
			{console.log('zong',appState.userName, appState.userEmail, appState.userPosition)}
			{appState.fields.data.map(x => {
				if (x.selected) {
					return (
						<div className='user-feedback'>
							<div className="card horizontal">
									<div className="card-image card-image-feedback">
										<img src={x.pic} />
									</div>
									<div className="card-stacked">
										<div className="card-content">
											<p className="flow-text">{x.name}</p>
											<FeedbackRating user={x} />
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
		if (appState.stage === 'user'){
			return (
				<div className="row">
					<div className="user-registry col s6 offset-s3">
						<UserInput />
						<div className="row center">
							<button className='waves-effect waves-light btn-large' onClick={() => this.advanceStage('selection')}>Start</button>
						</div>
					</div>
				</div>
			);
		} else if (appState.stage === 'selection') {
			return (
				<div>
					<p className="flow-text center selection-title">Please select the students you've had interactions with.</p>
					<div className='user-select-canvas'>
						{
							!appState.fields.loaded ? 'loading...' : this.allUsersDisplay()
						}
					</div>
					<div className="row center">
						<button className='waves-effect waves-light btn-large' onClick={() => this.advanceStage('feedback')}>Select</button>
					</div>
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
					<div className="row center">
						<button className='waves-effect waves-light btn-large' onClick={() => this.submitForm()}>Done</button>
					</div>
				</div>
			)
		} else if (appState.stage === 'done') {
			return(
				<div>
					<p className="flow-text center selection-title">Thank you for your feedback.</p>
				</div>
			)
		} else if (appState.stage === 'invalidLink') {
			return(
				<div>
					<div className="flow-text center">
						Invalid Request
					</div>
				</div>

			)
		}

	}
}

export default App;
