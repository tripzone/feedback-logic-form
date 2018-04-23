import React, { Component } from 'react';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import fetch from 'isomorphic-fetch';
import classNames from 'classnames';
import './App.css';
import { appState, User, serverLink, picPath } from './state.js'

const fetchUsers = (apiLink) => {
	return new Promise ((resolve, reject) => {
		fetch(serverLink+apiLink, {
			method: 'GET',
		}).then((x)=>resolve(x.json()))
			.catch((x)=>reject(null))
	});
}

appState.getAllUsers = function(school) {
	fetchUsers(school).then(x=> {
		x.forEach(y => {
			const picFile = y.pic ? picPath+y.pic : picPath+'placeholder.jpg';
			this.fields.data.push(new User(y.id, y.name, picFile))
		})
		this.fields.loaded = true;
	}).catch(this.fields.loaded = true)
}
appState.selectUser = function(id) {
	const userIndex = this.fields.data.findIndex(q => q.id === id);
	this.fields.data[userIndex].selected = !this.fields.data[userIndex].selected;
}
appState.advanceStage = function(nextStage) {
	this.stage = nextStage;
	window.scrollTo(0, 0);
	appState.submitValid = true;
}

class UserInput extends Component {
	render() {
		var usernameClassName = classNames({
			'validate': true,
			'invalid': appState.userName === '' && !appState.submitValid,
		})
		var positionClassName = classNames({
			'browser-default': true,
			'dropdown-invalid': appState.userPosition === '' && !appState.submitValid,
		})
		return(
			<div>
				<div className="row">
					<div className="input-field ">
						<input id="name" type="text" className={usernameClassName} onChange={this.onChangeName}/>
						<label for="name">Please enter your Name</label>
					</div>
				</div>
				<div className="row">
					<select className={positionClassName} onChange={this.onChangePosition}>
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
			'validation-fail': this.props.user.rating === '' && !appState.submitValid,
		});
		var sosoIconStyle = classNames({
			'feedback-rating-icon': true,
			'active-icon': this.props.user.rating === 'soso',
			'validation-fail': this.props.user.rating === '' && !appState.submitValid,
		});
		var yesIconStyle = classNames({
			'feedback-rating-icon': true,
			'active-icon': this.props.user.rating === 'yes',
			'validation-fail': this.props.user.rating === '' && !appState.submitValid,
		});
		var greatIconStyle = classNames({
			'feedback-rating-icon': true,
			'active-icon': this.props.user.rating === 'great',
			'validation-fail': this.props.user.rating === '' && !appState.submitValid,
		});
		return(
			<div>
				<div className="feedback-rating">
					<div className="flow-text col s12 m3"><h6>Good fit for Deloitte?</h6></div>
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
	@action onChange = (x) => {this.props.user.rating = x}
}

@observer class FeedbackPortal extends Component {
	advanceStage = (x) => {
		appState.advanceStage(x);
	}
	selectItem = (x) =>{
		appState.selectUser(x);
	}
	componentWillMount(){
		if (this.props.school !== '') {
			appState.getAllUsers('/'+this.props.school+'data');
		}
	}

	submitForm = (payload) => {
		const time = new Date().getTime();
		let data = {};
		payload.forEach((x,i)=>{
			data[time+i] =x;
		})

		fetch(serverLink+'/feedback', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'collection': this.props.school,
			},
			body: JSON.stringify(data)
		}).then((x)=>console.log('good',x)).catch((x)=>console.log('bad',x))
		this.advanceStage('done');
	}

	validateAndSelect = () => {
		if (appState.userName === '' || appState.userPosition ==='') {
			appState.submitValid = false
		} else {
			this.advanceStage('selection')
		}
	}

	validateAndSubmit = () => {
		const selectedUsers = appState.fields.data.filter(x=> x.selected === true);
		let validated = true;
		const date = new Date()
		const payload = selectedUsers.map(x=>{
			if (x.rating === '') {validated = false}
			return {name: x.name, id: x.id, comment: x.comment, rating: x.rating, userName: appState.userName, userPosition: appState.userPosition, date: date}
		})
		if (validated) {this.submitForm(payload)} else {appState.submitValid = false};
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
		{appState.fields.data.length === 0 ? <div className="center show">Server is down, please contact kzahir@deloitte.ca or try again later.</div> : null}
		</div>
	)}

	selectedUsersFeedback() {
		let count = 0;
		return (
			<div className="row">
			{appState.fields.data.map(x => {
				if (x.selected) {
					count=count+1;
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
			{(count === 0) ? <div className="flow-text center">You did not select any students!</div> : null}
			</div>
		)
	}


	render() {
		var showOrNot = classNames({
			'flow-text': true,
			'show': !appState.submitValid,
			'dont-show': appState.submitValid,
		})
		if (appState.stage === 'user'){
			return (
				<div>
					<div className="center">
						<img className="deloittelogo" src="../deloittelogo.png"></img>
					</div>
					<div className="row">
						<div className="user-registry col s6 offset-s3">
							<UserInput />
							<div className="row center">
								<div className={showOrNot}>missing required fields</div>
								<button className='waves-effect waves-light btn-large' onClick={() => this.validateAndSelect()}>Start</button>
							</div>
						</div>
					</div>
				</div>

			);
		} else if (appState.stage === 'selection') {
			return (
				<div>
					<p className="flow-text center selection-title">Please select the students you interacted with.</p>
					<div className='user-select-canvas'>
						{
							!appState.fields.loaded ? 'loading...' : this.allUsersDisplay()
						}
					</div>
					{ appState.fields.data.length !== 0 ?
					<div className="row center">
						<button className='waves-effect waves-light btn-large' onClick={() => this.advanceStage('feedback')}>Select</button>
					</div>	: null
					}
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
						<div className={showOrNot}>missing required fields</div>
						<button className='waves-effect waves-light btn-large' onClick={() => this.validateAndSubmit()}>Done</button>
					</div>
				</div>
			)
		} else if (appState.stage === 'done') {
			return(
				<div>
					<p className="flow-text center selection-title">Thank you for your feedback.</p>				</div>
			)
		}
	}
}

export default FeedbackPortal;
