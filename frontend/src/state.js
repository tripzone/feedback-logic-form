import { observable } from 'mobx';
import * as firebase from "firebase";

// export const serverLink = 'http://52.55.4.4:443';
export const serverLink = 'http://localhost:443';
export const picPath = serverLink+'/public/'

firebase.initializeApp(config);
var db = firebase.database();


const fetchData = (school) => {
	return new Promise ((resolve, reject) => {
		db.ref(school).once('value',
			result => resolve(result.val()),
			error => reject({status: 'fail', error: 'firebase read failed'})
		);
	});
}

const fetchUsers = (apiLink) => {
	return new Promise ((resolve, reject) => {
		fetch(serverLink+apiLink, {
			method: 'GET',
		}).then((x)=>resolve(x.json()))
			.catch((x)=>reject(null))
	});
}

export const addData = (school, body) => {
	db.ref(school).update(body,
		(err) => {
			if(err) {
				return ({status: 'fail', error: 'firebase write failed'});
			} else {
				return ({status: 'success'});
			}
	});
}

export class User {
	@observable selected = false;
	@observable comment = '';
	@observable rating = '';
	constructor(id, name, pic) {
		this.id = id;
		this.name = name;
		this.pic = pic;
	}
}
export const appState = observable({
	fields: observable({
		loaded: false,
		data: [],
	}),
	stage: 'user',
	userName: '',
	userPosition: '',
	submitValid: true,
})
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

export const ResultState = observable({
	loaded: false,
	students: observable({}),
})
ResultState.getAllUsers = function (school) {
	fetchData(school).then(x=>{
		console.log('x is here ', x)
		if(!!x) {
			Object.keys(x).forEach(
				y=> {
					if (!this.students[x[y].name]) {
						this.students[x[y].name] = new StudentData(x[y].name, x[y].id)
					}
					if (y.comment !=="") {
						this.students[x[y].name].comments.push({comment: x[y].comment, name: x[y].userName})
					}
					this.students[x[y].name].ratings[x[y].rating] += 1
				}
			)
		}

		this.loaded = true;
	})
}

export class StudentData {
	name = '';
	id = 0;
	comments = [];
	@observable ratings = {
		great: 0,
		yes: 0,
		soso: 0,
		no: 0,
	}
	constructor(name, id) {
		this.id = id;
		this.name = name;
	}
}
